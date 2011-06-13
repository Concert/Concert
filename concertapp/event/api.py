###
#   This file contains REST API functionality relating to events
###
from concertapp.collection.api import *
from concertapp.lib.api import MyResource, DjangoAuthentication
from concertapp.models import *
from concertapp.event.models import *
from concertapp.users.api import *
from concertapp.audiosegment.api import *

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
#   Make sure that the user who is creating event is a member of the related 
#   collection.
###
class EventAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        
        if super(EventAuthorization, self).is_authorized(request, object):
            
            #   If there is an object to authorize
            if object:
                #   Make sure that the person modifying is in the collection that the
                #   Event object belongs to.
                return (request.user in object.collection.users.all())
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False


###
#   A resource for base-event class.  Probably shouldn't be accessed through 
#   URLs because we don't know what type of event it is.
###
class EventResource(MyResource):
    user = fields.ForeignKey(UserResource, 'user')
    time = fields.DateField('time')
    collection = fields.ForeignKey(CollectionResource, 'collection')
    audioSegment = fields.ForeignKey(AudioSegmentResource, 'audioSegment', null=True)
    tag = fields.ForeignKey(TagResource, 'tag', null=True)
    audioFile = fields.ForeignKey(AudioFileResource, 'audioFile', null=True)
    eventType = fields.IntegerField('eventType')
    
    class Meta():
        queryset = Event.objects.all()
        
        authentication = DjangoAuthentication()
        authorization = EventAuthorization()
        

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


#####
#   A resource class for every type of event.  I know, ugh...
#   This is the exact same heirarchy as the models.
#####


class AudioSegmentCreatedEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = AudioSegmentCreatedEvent.objects.all()

class AudioSegmentTaggedEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = AudioSegmentTaggedEvent.objects.all()

class AudioFileUploadedEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = AudioFileUploadedEvent.objects.all()

class JoinCollectionEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = JoinCollectionEvent.objects.all()

class LeaveCollectionEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = LeaveCollectionEvent.objects.all()

class CreateCollectionEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = CreateCollectionEvent.objects.all()

class RequestJoinCollectionEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = RequestJoinCollectionEvent.objects.all()

class RequestDeniedEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = RequestDeniedEvent.objects.all()

class RequestRevokedEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = RequestRevokedEvent.objects.all()

class RequestJoinCollectionEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = RequestJoinCollectionEvent.objects.all()

class AudioSegmentCommentEventResource(CollectionEventResource):
    class Meta(CollectionEventResource.Meta):
        queryset = AudioSegmentCommentEvent.objects.all()

