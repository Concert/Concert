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
from concertapp.settings import TO_PROCESS_DIRECTORY

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
        os.rename(file.temporary_file_path(), tmpPath)
        os.chmod(tmpPath, 0777) # Probably a security risk.
        stats = os.stat(TO_PROCESS_DIRECTORY)


        # Handle encoding of audio file asynchronously
        tasks.handleNewAudioFile.delay(path=tmpPath, audioFileId=str(audioFile.id))

        audiofileResource = AudioFileResource()
        audiofileBundle = audiofileResource.full_dehydrate(audioFile)
        audiofileData = audiofileResource._meta.serializer.to_simple(audiofileBundle, {})

        # Return serialized audioFile so clientside has id
        return HttpResponse(simplejson.dumps(audiofileData))

    else:
        return HttpResponseBadRequest()


    #     return HttpResponse(status = 200)
                
    # else :        
    #     return TemplateResponse(request, 'audio/upload_audio.html', {
    #         'page_name': 'Upload Audio',
    #         'js_page_path': '/audio/upload/',
    #     })
