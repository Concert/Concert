###
# This file contains offline tasks to be run by
# celery.
###

from celery.task import task

import logging
logger = logging.getLogger('concertapp')


###
#   Used for initializing a new audio file.  This should be called
#   when the user has initially uploaded it.  If successful,
#   will simply change the audio file's status in the database.
#
#   @param  Audiofile   newAudioFile - the audio file object
#   @param  File        f - the actual temporary uploaded file
#   @throws     audiotools.EncodingError - upon encoding error
#   @throws     probably other stuff.
###
@task()
def handleNewAudioFile(**kwargs):
    log = self.get_logger(**kwargs)
    log.info('1. handleNewAudioFile running')
    print('2. handleNewAudioFile running')
    logger.info('3. handleNewAudioFile running')
    self.logger.info('4. handleNewAudioFile running')

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
        # from concertapp.event.models import AudioFileUploadedEvent
        # # if we're updating not initializing
        # if self.pk:
        #     return super(AudioFile,self).save(*args,**kwargs)
            
        # # Get original filename of uploaded file
        # name = str(f)
        # self.name = name
        
        # # Save ourself so we can get an id for the filename
        # super(AudioFile, self).save(*args, **kwargs)
        
        # # Using this AudioFile object's id, create filenames
        # idString = str(self.id)
        # wavName = idString+'.wav'
        # oggName = idString+'.ogg'
        # mp3Name = idString+'.mp3'
        

        # # grab the path of the temporary uploaded file.  This is where the user's
        # #   uploaded file exists currently.
        # inputFilePath = f.temporary_file_path()
        
        
        # #   Create files with dummy contents but with proper names.
        # self.wav.save(wavName, SimpleUploadedFile(wavName, 'temp contents'), save = False)
        # self.ogg.save(oggName, SimpleUploadedFile(oggName, 'temp contents'), save = False)
        # self.mp3.save(mp3Name, SimpleUploadedFile(mp3Name, 'temp contents'), save = False)
        
        # #   Now we placeholders for the audio files.
        
        # # The input is the temporary uploaded file location
        # wavInput = f.temporary_file_path()
        # # output was determined above
        # wavOutput = os.path.join(MEDIA_ROOT, self.wav.name)

        # #   the ogg file will be encoded from the normalized wav file
        # oggInput = wavOutput
        # oggOutput = os.path.join(MEDIA_ROOT, self.ogg.name)
                
        # #   and so will the mp3
        # mp3Input = wavOutput
        # mp3Output = os.path.join(MEDIA_ROOT, self.mp3.name)

        # #   now overwrite the dummy files with the actual encodes
        
        # # We will first normalize the wav file (convert to proper sample rate,
        # #   etc). NOTE: this doesn't actually mean "normalize" to 0db, but 
        # #   hopefully in the future.
        # audioHelpers.toNormalizedWav(wavInput, wavOutput)
        
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