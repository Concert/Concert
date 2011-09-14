from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.contrib.auth.decorators import login_required
from django.template.response import TemplateResponse
from django.template import RequestContext
from django.core.cache import cache
from django.utils import simplejson
from django.core.files.uploadedfile import SimpleUploadedFile

from django.core.exceptions import ObjectDoesNotExist

import os, hashlib, tempfile, audiotools, tempfile

from concertapp.models  import *
from concertapp.collection.models import Collection

from concertapp.audiofile import audioHelpers
from concertapp.audiofile.waveform import *
from concertapp.settings import MEDIA_ROOT, LOGIN_REDIRECT_URL


##
# The upload_audio page.  User goes here to upload audio to a specific collection.
#
# @param    request HTTP Request
##
@login_required
def upload_audio(request):
    print('upload_audio')
    user = request.user
    
    username = user.username

    if request.method == 'POST':
        print('POST to upload_audio')
        if request.FILES == None:
            return HttpResponseBadRequest('Must have files attached!')

        print('Receiving file')
        file = request.FILES[u'files[]']
        print('Received file: ')
        print(str(file))

        
        # The collection that this audioFile object is to be associated with.
        try:
            col_id = request.POST['collection_id']
            col = Collection.objects.get(id = request.POST['collection_id'])
        except ObjectDoesNotExist, e:
            raise Exception('Invalid collection chosen.')
        

        return HttpResponse(status = 200)

        #   new audioFile object
        # audioFile = AudioFile(uploader = user, collection=col)

        

    #     try:
    #         #   initialize audioFile object (this will take a while as we have to encode)
    #         audioFile.save(f)
    #     except audiotools.UnsupportedFile, e:
    #         # Delete audioFile object that was partially created.
    #         audioFile.delete()
    #         raise Exception('Unsupported file type.')
    #     except audiotools.PCMReaderError, e:
    #         # Delete audioFile object that was partially created.
    #         audioFile.delete()
    #         raise Exception('Error reading file.')
    #     except IOError, e:
    #         # Delete audioFile object that was partially created.
    #         audioFile.delete()
    #         raise Exception('An error occured while file handling: '+str(e))
    #     except Exception, e:
    #         audioFile.delete()
    #         raise Exception(str(e))

    #     return HttpResponse(status = 200)
                
    # else :        
    #     return TemplateResponse(request, 'audio/upload_audio.html', {
    #         'page_name': 'Upload Audio',
    #         'js_page_path': '/audio/upload/',
    #     })
