from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.template.response import TemplateResponse
from django.template import RequestContext
from django.core.cache import cache
from django.utils import simplejson

from concertapp.collection.models import Collection
from concertapp.audiofile.models import AudioFile

from concertapp.audiofile import tasks
from concertapp.audiofile.api import AudioFileResource

import os
from shutil import copyfile
from concertapp.settings import TO_PROCESS_DIRECTORY, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET

from boto.s3.connection import S3Connection

import logging
log = logging.getLogger('concertapp')

##
# The upload_audio page.  User goes here to upload audio to a specific collection.
#
# @param    request HTTP Request
##
@login_required
def upload_audio(request):
    log.info('upload_audio')
    user = request.user
    
    username = user.username

    if request.method == 'POST':
        log.info('POST to upload_audio')
        if request.FILES == None:
            return HttpResponseBadRequest('Must have files attached!')

        file = request.FILES[u'files[]']
        
        # The collection that this audioFile object is to be associated with.
        try:
            col_id = request.POST['collection_id']
            col = Collection.objects.get(id = request.POST['collection_id'])
        except ObjectDoesNotExist, e:
            raise Exception('Invalid collection chosen.')
        

        # create new audioFile object
        audioFile = AudioFile(uploader = user, collection=col, name=file.name)
        audioFile.save()

        # Move file to "to_upload" folder so Django doesn't delete it.
        tmpPath = os.path.join(TO_PROCESS_DIRECTORY, file.name)

	log.info('copying file from {0} to {1}'.format(file.temporary_file_path(), tmpPath))
        copyfile(file.temporary_file_path(), tmpPath)


        # Handle encoding of audio file asynchronously
        tasks.handleNewAudioFile.delay(path=tmpPath, audioFileId=str(audioFile.id))

        audiofileResource = AudioFileResource()
        audiofileBundle = audiofileResource.full_dehydrate(audioFile)
        audiofileData = audiofileResource._meta.serializer.to_simple(audiofileBundle, {})

        # Return serialized audioFile so clientside has id
        return HttpResponse(simplejson.dumps(audiofileData))

    else:
        return HttpResponseBadRequest()

@login_required
def get_audio_src(request, audio_id):
    log.info('get_audio_src')

    # All links will expire in 24 hours
    expiresIn = 60 * 60 * 24

    conn = S3Connection(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
    bucket = conn.get_bucket(S3_BUCKET)

    result = {
        'audioSrc': {
            'ogg': '',
            'mp3': ''
        },
        'waveformSrc': {
            # Waveform images go here indexed by ZOOM_LEVEL
        }
    }

    # Get link for mp3
    mp3Key = bucket.get_key('{0}.mp3'.format(audio_id))
    result['audioSrc']['mp3'] = mp3Key.generate_url(expiresIn)

    # Get link for ogg
    oggKey = bucket.get_key('{0}.ogg'.format(audio_id))
    result['audioSrc']['ogg'] = oggKey.generate_url(expiresIn)

    # For each zoom level
    for zoomLevel in AudioFile.ZOOM_LEVELS:
        # Get link for waveform at this zoom level
        waveformKey = bucket.get_key('{0}-{1}.png'.format(audio_id, zoomLevel))
        result['waveformSrc'][zoomLevel] = waveformKey.generate_url(expiresIn)

    return HttpResponse(simplejson.dumps(result))

    