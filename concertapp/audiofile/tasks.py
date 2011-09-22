###
# This file contains offline tasks to be run by
# celery.
###
import os

from celery.task import task

from concertapp.audiofile.models import AudioFile

from django.core.files.uploadedfile import SimpleUploadedFile

from concertapp.settings import FILE_UPLOAD_TEMP_DIR


import logging
logger = logging.getLogger('concertapp')



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
    audioFile.progress = 0.00
    audioFile.save()
    
    # Using this AudioFile object's id, create paths for encoded files
    idString = str(audioFile.id)
    wavPath = os.path.join(FILE_UPLOAD_TEMP_DIR, idString+'.wav')
    oggPath = os.path.join(FILE_UPLOAD_TEMP_DIR, idString+'.ogg')
    mp3Path = os.path.join(FILE_UPLOAD_TEMP_DIR, idString+'.mp3')

    # We will first normalize the wav file (convert to proper sample rate,
    #   etc). NOTE: this doesn't actually mean "normalize" to 0db, but 
    #   hopefully in the future.
    audioHelpers.toNormalizedWav(wavInput, wavOutput)

    logger.info('\n-----\nhandleNewAudioFile success')
    return True

    # try:
    #     # initialize newAudioFile object (this will take a while as we have to encode)
    #     newAudioFile.save(f)
    # except audiotools.UnsupportedFile, e:
    #     # Delete newAudioFile object that was partially created.
    #     newAudioFile.delete()
    #     raise Exception('Unsupported file type.')
    # except audiotools.PCMReaderError, e:
    #     # Delete newAudioFile object that was partially created.
    #     newAudioFile.delete()
    #     raise Exception('Error reading file.')
    # except IOError, e:
    #     # Delete newAudioFile object that was partially created.
    #     newAudioFile.delete()
    #     raise Exception('An error occured while file handling: '+str(e))
    # except Exception, e:
    #     newAudioFile.delete()
    #     raise Exception(str(e))

        

                
        
        # #   Do the same for ogg
        # audioHelpers.toOgg(oggInput, oggOutput)
        
        # #   and mp3
        # audioHelpers.toMp3(mp3Input, mp3Output)
        
        # # Generate the waveform onto disk
        # self._generate_waveform()
        
        # # Save duration of audio file in seconds
        # self.duration = audioHelpers.getLength(wavOutput)

        # super(AudioFile, self).save(*args, **kwargs)
        
        # event = AudioFileUploadedEvent(
        #   user = self.uploader,
        #   audioFile = self,
        #   collection = self.collection
        # )
        # event.save()