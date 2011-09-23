###
# This file contains offline tasks to be run by
# celery.
###
import os

from celery.task import task

from concertapp.audiofile.models import AudioFile
from concertapp.audiofile import audioHelpers

from django.core.files.uploadedfile import SimpleUploadedFile

from concertapp.settings import TO_PROCESS_DIRECTORY



import logging
logger = logging.getLogger('concertapp')

from decimal import Decimal



###
#   Used for initializing a new audio file.  This should be called
#   when the user has initially uploaded it.  If successful,
#   will simply change the audio file's status in the database.
#
#   @param  Number  audioFileId - the id of the AudioFile object
#   @param  String  path - the full path to the temporary uploaded file
###
@task()
def handleNewAudioFile(audioFileId=None, path=None, **kwargs):
    logger.info('\n-----\nhandleNewAudioFile running')

    audioFile = AudioFile.objects.get(pk=audioFileId)

    # Update audioFile status for browser
    audioFile.status = 'p'
    audioFile.progress = 0
    audioFile.save()

    # Using this AudioFile object's id, create paths for encoded files
    idString = str(audioFile.id)
    wavPath = os.path.join(TO_PROCESS_DIRECTORY, idString+'.wav')
    oggPath = os.path.join(TO_PROCESS_DIRECTORY, idString+'.ogg')
    mp3Path = os.path.join(TO_PROCESS_DIRECTORY, idString+'.mp3')

    def progressCallback(x, y):
        rawPercent = Decimal(x)/Decimal(y)
        thisProgress = (rawPercent*progressCallback.progressScale).quantize(Decimal('.01'))

        newTotalProgress = progressCallback.prevProgress + thisProgress
        
        if newTotalProgress != progressCallback.cache:
            progressCallback.cache = newTotalProgress

            logger.info('progress: {0}'.format(str(newTotalProgress)))
    
    # The total progress for this audiofile thus far
    progressCallback.prevProgress = Decimal('0')
    # Factor to scale current task against the total progress
    progressCallback.progressScale = Decimal('0.16')
    # Cache so we don't send the same progress more than once
    progressCallback.cache = Decimal('0')
    
    def errorHandler(e):
        audioFile.status = 'e'
        audioFile.save()
        logger.error('Error while converting to wav:')
        logger.error(str(e))
    
    convertingMsg = 'Converting {0} to {1}'

    # We'll say the progress breakdown is as follows:
    #   0% - 50%: Encoding
    #       0 - 16%:    Converting to .wav
    #       16 - 32%:   Converting to .mp3
    #       32% - 50%:  Converting to .ogg
    #   50% - 60%: Generating waveform
    #   60% - 100%: Transferring (to S3)


    try:
        # We will first normalize the wav file (convert to proper sample rate,
        #   etc). NOTE: this doesn't actually mean "normalize" to 0db, but 
        #   hopefully in the future.
        logger.info(convertingMsg.format(path, wavPath))
        audioHelpers.toNormalizedWav(path, wavPath, progressCallback)
        progressCallback.prevProgress = Decimal('0.16')
    except Exception, e:
        errorHandler(e)
    
    try:
        # Convert to ogg
        logger.info(convertingMsg.format(wavPath, oggPath))
        # audioHelpers.toOgg(wavPath, oggPath, progressCallback)
        progressCallback.prevProgress = Decimal('0.32')
    except Exception, e:
        errorHandler(e)
    
    try:
        # Convert to mp3
        logger.info(convertingMsg.format(wavPath, mp3Path))
        # audioHelpers.toMp3(wavPath, mp3Path, progressCallback)
        progressCallback.prevProgress = Decimal('0.50')
    except Exception, e:
        errorHandler(e)
    

    ###
    #   Return a path to a waveform image for this AudioFile object at a given
    #   zoom level.
    #   
    #   @param  {Number}    zoomLevel    -  The given zoom level.
    ###
    # def get_waveform_path(audioFile, zoomLevel):
    #     return os.path.join(
    #         TO_PROCESS_DIRECTORY, str(zoomLevel), str(audioFile.id)+'.png'
    #     )

    # Waveform generation only counts for 10%
    progressCallback.progressScale = Decimal('0.10')

    # Generate the waveform onto disk
    # Get length of audio (samples)
    length = audioHelpers.getLength(wavPath)

    # For each zoom level
    for zoomLevel in AudioFile.ZOOM_LEVELS:
        # Path to the image for the waveform at this zoom level
        waveformPath = os.path.join(TO_PROCESS_DIRECTORY, idString + '-' + str(zoomLevel) + '.png')
        logger.info('Creating waveform image {0}'.format(waveformPath))

        audioHelpers.generateWaveform(
            # from this wave file
            wavPath, 
            # put waveform here
            waveformPath, 
            # At zoomLevel px per second (width)
            zoomLevel * length, 
            # Height
            AudioFile.WAVEFORM_IMAGE_HEIGHT,
            progress=progressCallback
        )
        progressCallback.prevProgress = Decimal('0.60')
    


    # Save duration of audio file in seconds
    audioFile.duration = audioHelpers.getLength(wavPath)
    # Save current progress of audio file
    audioFile.progress = progressCallback.prevProgress

    audioFile.save()

    logger.info('\n-----\nhandleNewAudioFile success')
    return True
        
        
        
        

        # super(AudioFile, self).save(*args, **kwargs)
        
        # event = AudioFileUploadedEvent(
        #   user = self.uploader,
        #   audioFile = self,
        #   collection = self.collection
        # )
        # event.save()