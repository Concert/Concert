from concertapp.audiofile import audioHelpers
from concertapp.settings import MEDIA_ROOT
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.core.files  import File
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
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
    uploader = models.ForeignKey(User, related_name="uploadedFiles")
    collection = models.ForeignKey(Collection, related_name="files")
    wav = models.FileField(upload_to = AUDIO_LOCATION)
    ogg = models.FileField(upload_to = AUDIO_LOCATION)
    mp3 = models.FileField(upload_to = AUDIO_LOCATION)
    # The duration of the audio file.  Default is 0
    duration = models.DecimalField(max_digits = 8, decimal_places = 2, default=0)

    # The status of this file
    status = models.CharField(
        max_length=1,
        choices=(
            ('u', 'Uploading'),
            ('p', 'Processing'),
            ('d', 'Done')
        ),
        # File is initially uploading
        default='u'
    )
    # The progress of the current stage
    progress = models.DecimalField(max_digits = 3, decimal_places = 2, default = 0)
    
    def __unicode__(self):
        return self.name
        
    # Delete the current audio file from the filesystem
    def delete(self):
        from concertapp.audiosegment.models import AudioSegment
        from concertapp.event.models import AudioFileUploadedEvent
        
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
        wavPathAbsolute = os.path.join(MEDIA_ROOT, 'audio', wavPath)
        
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
