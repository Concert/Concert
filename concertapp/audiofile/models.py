from concertapp.audiofile import audioHelpers
from concertapp.settings import MEDIA_ROOT
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.core.files  import File
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import models
from django.db.models.signals import post_save
from django.core.exceptions import ObjectDoesNotExist
import audiotools
import os, tempfile, sys

from concertapp.collection.models import *

class AudioFile(models.Model):
    # The zoom levels (px per second) for images that will be created.  A directory
    # for each of these numbers should exist in the MEDIA_ROOT/waveforms/ directory
    ZOOM_LEVELS = [10]
    # The height of each waveform image
    WAVEFORM_IMAGE_HEIGHT = 198
    WAVEFORM_LOCATION = 'waveforms/'
    AUDIO_LOCATION = 'audio/'
    name = models.CharField(max_length = 100)
    uploader = models.ForeignKey(User)
    collection = models.ForeignKey(Collection, related_name="files")
    wav = models.FileField(upload_to = AUDIO_LOCATION)
    ogg = models.FileField(upload_to = AUDIO_LOCATION)
    mp3 = models.FileField(upload_to = AUDIO_LOCATION)
    # The duration of the audio file.  Default is 0
    duration = models.DecimalField(max_digits = 8, decimal_places = 2, default=0)
    
    def __unicode__(self):
        return self.name

    ###
    #   Do everything necessary when an audio object is first created.
    #   
    #   @param  f        File object from request.FILES
    #
    #   @throws     audiotools.EncodingError - upon encoding error
    #   @throws     probably other stuff.
    def save(self, f = None, *args, **kwargs):
        # if we're updating not initializing
        if self.pk:
            return super(AudioFile,self).save(*args,**kwargs)
            
        # Get original filename of uploaded file
        name = str(f)
        self.name = name
        
        # Save ourself so we can get an id for the filename
        super(AudioFile, self).save(*args, **kwargs)
        
        # Using this AudioFile object's id, create filenames
        idString = str(self.id)
        wavName = idString+'.wav'
        oggName = idString+'.ogg'
        mp3Name = idString+'.mp3'
        

        # grab the path of the temporary uploaded file.  This is where the user's
        #   uploaded file exists currently.
        inputFilePath = f.temporary_file_path()
        
        
        #   Create files with dummy contents but with proper names.
        self.wav.save(wavName, SimpleUploadedFile(wavName, 'temp contents'), save = False)
        self.ogg.save(oggName, SimpleUploadedFile(oggName, 'temp contents'), save = False)
        self.mp3.save(mp3Name, SimpleUploadedFile(mp3Name, 'temp contents'), save = False)
        
        #   Now we placeholders for the audio files.
        
        # The input is the temporary uploaded file location
        wavInput = f.temporary_file_path()
        # output was determined above
        wavOutput = os.path.join(MEDIA_ROOT, self.wav.name)

        #   the ogg file will be encoded from the normalized wav file
        oggInput = wavOutput
        oggOutput = os.path.join(MEDIA_ROOT, self.ogg.name)
                
        #   and so will the mp3
        mp3Input = wavOutput
        mp3Output = os.path.join(MEDIA_ROOT, self.mp3.name)

        #   now overwrite the dummy files with the actual encodes
        
        # We will first normalize the wav file (convert to proper sample rate,
        #   etc). NOTE: this doesn't actually mean "normalize" to 0db, but 
        #   hopefully in the future.
        audioHelpers.toNormalizedWav(wavInput, wavOutput)
        
        #   Do the same for ogg
        audioHelpers.toOgg(oggInput, oggOutput)
        
        #   and mp3
        audioHelpers.toMp3(mp3Input, mp3Output)
        
        # Generate the waveform onto disk
        self._generate_waveform()
        
        # Save duration of audio file in seconds
        self.duration = audioHelpers.getLength(wavOutput)

        super(AudioFile, self).save(*args, **kwargs)
        
        event = AudioFileUploadedEvent(
          user = self.uploader,
          audioFile = self,
          collection = self.collection
        )
        event.save()
        
        
    # Delete the current audio file from the filesystem
    def delete(self):
        
        # Remove wav from this object, and delete file on filesystem.
        if(self.wav and os.path.exists(self.wav.name)):
            # These lines should delete the files, but i'm getting an error that
            #   I don't understand.
            #self.wav.delete(save=False)
            
            #   So instead, lets just delete the file manually.
            os.unlink(self.wav.name)
            
        # Remove ogg
        if(self.ogg and os.path.exists(self.ogg.name)):
            #self.ogg.delete(save=False)
            os.unlink(self.ogg.name)
        
        # Remove mp3
        if(self.mp3 and os.path.exists(self.mp3.name)):
            #self.mp3.delete(save=False)
            os.unlink(self.mp3.name)

        # For each zoom level
        for zoomLevel in AudioFile.ZOOM_LEVELS:
            # Path to waveform image for this zoom level
            waveformPath = self._get_waveform_path(zoomLevel)
            # If image exists at this zoom level
            if(os.path.exists(waveformPath)):
                # Remove it
                os.unlink(waveformPath)
            

        # Get all segments who have this audio object as its parent
        segments = AudioSegment.objects.filter(audioFile = self)

        # Delete all of the segments
        for segment in segments:
            segment.delete()

        for event in AudioFileUploadedEvent.objects.filter(audioFile=self):
            event.active = False

        # Send delete up if necessary.  This will not happen if the audio object
        #   has not called save()
        if(self.id):
            super(AudioFile, self).delete()

    ###
    #   Return a path to a waveform image for this AudioFile object at a given
    #   zoom level.
    #   
    #   @param  {Number}    zoomLevel    -  The given zoom level.
    ###
    def _get_waveform_path(self, zoomLevel):
        return os.path.join(
            MEDIA_ROOT, AudioFile.WAVEFORM_LOCATION, str(zoomLevel), str(self.id)+'.png'
        )

    ##
    # Generate all the waveforms for this audio object.  
    #
    def _generate_waveform(self):
        # Relative path to our wave file (from MEDIA_ROOT)
        wavPath = self.wav.name
        # Absolute path to our wave file
        wavPathAbsolute = os.path.join(MEDIA_ROOT, wavPath)
        
        idString = str(self.id)
        
        # Get length of audio (samples)
        length = audioHelpers.getLength(wavPathAbsolute)        

        # For each zoom level
        for zoomLevel in AudioFile.ZOOM_LEVELS:
            # Path to the image for the waveform at this zoom level
            waveformPath = self._get_waveform_path(zoomLevel)
            audioHelpers.generateWaveform(
                # from this wave file
                wavPathAbsolute, 
                # put waveform here
                waveformPath, 
                # At zoomLevel px per second (width)
                zoomLevel * length, 
                # Height
                AudioFile.WAVEFORM_IMAGE_HEIGHT
            )
