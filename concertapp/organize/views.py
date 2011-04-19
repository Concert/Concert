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

from concertapp.collection.api import *
from concertapp.audio.api import *
from concertapp.audiosegments.api import *
from concertapp.tags.api import *
from concertapp.comment.api import *
from concertapp.event.api import *


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
    
    singleCollectionResource = SingleCollectionResource()
    singleCollectionResource.set_collection(col)
    
    # send in events of all types for this collection
    audioSegmentCreatedEventResource = AudioSegmentCreatedEventResource()
    audioSegmentCreatedEventResource.set_collection(col)
    
    audioSegmentTaggedEventResource = AudioSegmentTaggedEventResource()
    audioSegmentTaggedEventResource.set_collection(col)
    
    audioFileUploadedEventResource = AudioFileUploadedEventResource()
    audioFileUploadedEventResource.set_collection(col)

    joinCollectionEventResource = JoinCollectionEventResource()
    joinCollectionEventResource.set_collection(col)

    leaveCollectionEventResource = LeaveCollectionEventResource()
    leaveCollectionEventResource.set_collection(col)
    
    createCollectionEventResource = CreateCollectionEventResource()
    createCollectionEventResource.set_collection(col)
    
    requestJoinCollectionEventResource = RequestJoinCollectionEventResource()
    requestJoinCollectionEventResource.set_collection(col)
    
    requestDeniedEventResource = RequestDeniedEventResource()
    requestDeniedEventResource.set_collection(col)
    
    requestRevokedEventResource = RequestRevokedEventResource()
    requestRevokedEventResource.set_collection(col)
    
    requestJoinCollectionEventResource = RequestJoinCollectionEventResource()
    requestJoinCollectionEventResource.set_collection(col)
    
    
    
    data = {
        'collectionData': singleCollectionResource.as_dict(request)[0], 
        'audioSegmentCreatedEventData': audioSegmentCreatedEventResource.as_dict(request), 
        'audioSegmentTaggedEventData': audioSegmentTaggedEventResource.as_dict(request), 
        'audioFileUploadedEventData': audioFileUploadedEventResource.as_dict(request), 
        'joinCollectionEventData': joinCollectionEventResource.as_dict(request), 
        'leaveCollectionEventData': leaveCollectionEventResource.as_dict(request), 
        'createCollectionEventData': createCollectionEventResource.as_dict(request), 
        'requestJoinCollectionEventData': requestJoinCollectionEventResource.as_dict(request), 
        'requestDeniedEventData': requestDeniedEventResource.as_dict(request), 
        'requestRevokedEventData': requestRevokedEventResource.as_dict(request), 
        'requestJoinCollectionEventData': requestJoinCollectionEventResource.as_dict(request)
    }
    
    return TemplateResponse(request, 'organize/organize_collection.html', {
        'page_name': 'Organize '+ col.name,
        'js_page_path': '/organize/collection/',
        'data': data, 
    });
