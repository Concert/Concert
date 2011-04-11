###
#   This file contains REST API functionality relating to events
###
from concertapp.collection.api import *
from concertapp.lib.api import MyResource, DjangoAuthentication
from concertapp.models import *
from concertapp.users.api import *
from concertapp.audiosegments.api import *
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.http import *
from tastypie.resources import ModelResource, Resource
from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
from urlparse import parse_qs

###
#   A resource for base-event class.  Probably shouldn't be accessed through 
#   URLs because we don't know what type of event it is.
###
class EventResource(MyResource):
    user = fields.ForeignKey(UserResource, 'user')
    time = fields.DateTimeField('time')
    collection = fields.ForeignKey(CollectionResource, 'collection')
    
    class Meta:
        authentication = DjangoAuthentication()
        
        queryset = Event.objects.all()

class AudioSegmentCreatedEventResource(EventResource):
    audioSegment = fields.ForeignKey(AudioSegmentResource, 'audioSegment')
    
    class Meta(EventResource.Meta):
        queryset = AudioSegmentCreatedEvent.objects.all()

        
class RequestJoinCollectionEventResource(EventResource):
    class Meta(EventResource.Meta):
        queryset = RequestJoinCollectionEvent.objects.all()

###
#   The events for a single collection
###
class CollectionEventResource(EventResource):
    
    class Meta(EventResource.Meta):
        
        # The collection
        collection = None
    
    ###
    #   Set the collection whose events we will retrieve.
    ###
    def set_collection(self, collection):
        self._meta.collection = collection
        
    
    ###
    #   Only retrieve events for a single collection
    ###
    def apply_authorization_limits(self, request, object_list):
        if not self._meta.collection:
            raise Exception('You must call set_collection on this resource first')

        return super(CollectionEventResource, self).apply_authorization_limits(request, object_list.filter(collection=self._meta.collection))
