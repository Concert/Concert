from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.template.response import TemplateResponse
from django.template import RequestContext
from django.core.cache import cache
from django.utils import simplejson
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist

import os, hashlib, tempfile, audiotools, json

from concertapp.models  import *

from concertapp.audio import audioHelpers
from concertapp.audio.waveform import *
from concertapp.settings import MEDIA_ROOT, LOGIN_REDIRECT_URL

from concertapp.decorators import user_is_member_and_collection_exists

from concertapp.audio.api import *
from concertapp.audiosegments.api import *
from concertapp.tags.api import *
from concertapp.comment.api import *


###
#   The main organize page for a collection.  This is where we do it all.
#
#   @param  collection_id       Number  -  The id of the collection, populated from
#                               the url.
#   @param  col                 Collection  -    The collection object, passed in
#                               from decorator, so we don't have to query for it
#                               again.
#   @param  user                User - the user object, passed in from decorator  
###
@login_required
@user_is_member_and_collection_exists
def organize_collection(request, collection_id, col, user):
    
    audioResource = CollectionAudioFileResource()
    audioResource.set_collection(col)
    
    segmentResource = CollectionAudioSegmentResource()
    segmentResource.set_collection(col)
    
    tagsResource = CollectionTagResource()
    tagsResource.set_collection(col)
    
#    commentResource = CollectionSegmentCommentResource()
#    commentResource.set_collection(col)
        
    data = {
        'files': audioResource.as_dict(request), 
        'segments': segmentResource.as_dict(request),
        'tags': tagsResource.as_dict(request), 
 #       'segmentComments': commentResource.as_dict(request)
    }
    
    return TemplateResponse(request, 'organize/organize_collection.html', {
        'page_name': 'Organize '+ col.name,
        'js_page_path': '/organize/collection/',
        'data': data, 
    });
