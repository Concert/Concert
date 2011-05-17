from concertapp.lib.api import NestedResource, ConcertAuthorization, DjangoAuthentication
from concertapp.models import *
from concertapp.users.api import *
from concertapp.audio.api import AudioFileResource
from concertapp.collection.api import CollectionResource
from concertapp.tags.api import TagResource
from concertapp.comment.api import CommentResource
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.http import *
from tastypie.utils import trailing_slash
import re

###
#   Make sure that the user who is trying to modify the board is the administrator.
###
class AudioSegmentAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        if super(AudioSegmentAuthorization, self).is_authorized(request, object):
            #   Get is always allowed, since we're just requesting information about
            #   the collection.
            if request.method == 'GET':
                return True
            
            #   If there is an object to authorize
            if object:
                #   Make sure that the person modifying is in the collection that the audiosegment belongs to.
                return (request.user in object.audioFile.collection.users.all())
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False


class AudioSegmentResource(NestedResource):
    name = fields.CharField('name')
    beginning = fields.FloatField('beginning')
    end = fields.FloatField('end')
    creator = fields.ForeignKey(UserResource, 'creator') 
    audioFile = fields.ForeignKey(AudioFileResource, 'audioFile')
    tags = fields.ManyToManyField(TagResource, 'tags', null=True)
    collection = fields.ForeignKey(CollectionResource, 'collection')
    events = fields.ManyToManyField(
        'concertapp.event.api.EventResource',
        'events',
        null=True
    )
    
    class Meta(NestedResource.Meta):
        authentication = DjangoAuthentication()
        authorization = AudioSegmentAuthorization()
        queryset = AudioSegment.objects.all()
        
        filtering = {
            "tags": ALL
            }

        nested = 'tags'
        
    def create_nested_event(self, obj, nested_obj, request):
        AudioSegmentTaggedEvent.objects.create(
            collection = obj.collection,
            audioSegment = obj,
            tag = nested_obj,
            user = request.user
        )
        return


###
#   A resource for audio segments from a single collection
###        
class CollectionAudioSegmentResource(AudioSegmentResource):
    
    class Meta(AudioSegmentResource.Meta):
        collection = None
        
    def set_collection(self, collection):
        self._meta.collection = collection
        
    ###
    #   Only retrieve audio segments for a specific collection
    ###
    def apply_authorization_limits(self, request, object_list):
        if not self._meta.collection:
            raise Exception('You must call set_collection on this resource first')
            
        return super(CollectionAudioSegmentResource, self).apply_authorization_limits(request, object_list.filter(collection=self._meta.collection))
