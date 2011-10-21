###
# This file contains offline tasks to be run by
# celery.
###
import os

from celery.task import task

from concertapp.audiofile.models import AudioFile
from concertapp.audiofile import audioHelpers

from django.core.files.uploadedfile import SimpleUploadedFile

from concertapp.settings import TO_PROCESS_DIRECTORY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET



import logging
logger = logging.getLogger('concertapp')

from decimal import Decimal

from boto.s3.connection import S3Connection
from boto.s3.key import Key

###
#   Uploads a file to S3 using the same filename.
#
#   @param  String  filePath    -   The path to the local
#   file to upload to the S3 bucket defined in concertapp.settings.
#   @param  Function    progressCallback    -   The progress callback
###
def uploadToS3(filePath, progressCallback=None):
    logger.info('Opening S3 connection')
    conn = S3Connection(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    logger.info('Opening "{0}" bucket'.format(S3_BUCKET))
    bucket = conn.get_bucket(S3_BUCKET)

    logger.info('Uploading {0} to {1}/{2}'.format(filePath, S3_BUCKET, os.path.basename(filePath)))
    key = bucket.new_key(key_name=os.path.basename(filePath))
    key.set_contents_from_filename(filePath, cb=progressCallback)


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
            audioFile.progress = newTotalProgress
            audioFile.save()

    # progressCallback can have a reference to the audioFile (I don't know how 
    # to do scoping in Python)
    progressCallback.audioFile = audioFile
    # The total progress for this audiofile thus far
    progressCallback.prevProgress = Decimal('0')
    # Cache so we don't send the same progress more than once
    progressCallback.cache = Decimal('0')
    
    def errorHandler(e):
        audioFile.status = 'e'
        audioFile.save()
        logger.error('Error while converting to wav:')
        logger.error(str(e))
    
    convertingMsg = 'Converting {0} to {1}'

    # We'll say the progress breakdown is as follows:
    #   0% - 90%: Encoding and uploading audio
    #       0 - 30: Generating wav
    #       30 - 50: Generating ogg
    #       50 - 60: Uploading ogg
    #       60 - 80: Generating mp3
    #       80 - 90: Uploading mp3
    #   90 - 100: Generating and uploading waveforms


    # Factor to scale current task against the total progress
    progressCallback.progressScale = Decimal('0.30')

    try:
        # We will first normalize the wav file (convert to proper sample rate,
        #   etc). NOTE: this doesn't actually mean "normalize" to 0db, but 
        #   hopefully in the future.
        logger.info(convertingMsg.format(path, wavPath))
        audioHelpers.toNormalizedWav(path, wavPath, progressCallback)

        # Save duration of audio file in seconds
        audioFile.duration = audioHelpers.getLength(wavPath)

        progressCallback.prevProgress = Decimal('0.30')
    except Exception, e:
        errorHandler(e)
    
    progressCallback.progressScale = Decimal('0.20')

    try:
        # Convert to ogg
        logger.info(convertingMsg.format(wavPath, oggPath))
        audioHelpers.toOgg(wavPath, oggPath, progressCallback)
        progressCallback.prevProgress = Decimal('0.50')

        progressCallback.progressScale = Decimal('0.10')

        # Upload to S3
        uploadToS3(oggPath, progressCallback)
        # Delete
        os.remove(oggPath)

        progressCallback.prevProgress = Decimal('0.60')
    except Exception, e:
        errorHandler(e)


    progressCallback.progressScale = Decimal('0.20')
    
    try:
        # Convert to mp3
        logger.info(convertingMsg.format(wavPath, mp3Path))
        audioHelpers.toMp3(wavPath, mp3Path, progressCallback)
        progressCallback.prevProgress = Decimal('0.80')

        progressCallback.progressScale = Decimal('0.10')

        # Upload
        uploadToS3(mp3Path, progressCallback)
        # Delete
        os.remove(mp3Path)
        progressCallback.prevProgress = Decimal('0.90')
    except Exception, e:
        errorHandler(e)
    

    # Waveform generation only counts for 10%
    progressCallback.progressScale = Decimal('0.10') / len(AudioFile.ZOOM_LEVELS)

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

        # Upload waveform images as they're created
        uploadToS3(waveformPath, progressCallback)
        # Then delete
        os.remove(waveformPath)

        progressCallback.prevProgress += progressCallback.progressScale
    



    # Delete wav
    os.remove(wavPath)
    # Delete original uploaded file
    os.remove(path)

    # We are done
    audioFile.progress = 1
    audioFile.status = 'd'
    audioFile.save()

    logger.info('\n-----\nhandleNewAudioFile success')
    return True