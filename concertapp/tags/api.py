from concertapp.lib.api import NestedResource, ConcertAuthorization, DjangoAuthentication
from concertapp.models import *
from concertapp.users.api import *
from concertapp.collection.api import CollectionResource
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import convert_post_to_put
from tastypie.http import *
from tastypie.exceptions import NotFound, BadRequest, InvalidFilterError, HydrationError, InvalidSortError, ImmediateHttpResponse

###
#   Make sure that the user who is trying to modify the board is the administrator.
###
class TagAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        
        if super(TagAuthorization, self).is_authorized(request, object):
            #   Get is always allowed, since we're just requesting information about
            #   the collection.
            if request.method == 'GET':
                return True
            
            #   If there is an object to authorize
            if object:
                #   Make sure that the person modifying is in the collection that the tag belongs to.
                return (request.user in object.collection.users.all())
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False

class TagResource(NestedResource):
    creator = fields.ForeignKey(UserResource, 'creator')
    collection = fields.ForeignKey(CollectionResource, "collection")
    segments = fields.ToManyField('concertapp.audiosegments.api.AudioSegmentResource', 'segments', null = True)
    events = fields.ManyToManyField(
        'concertapp.event.api.EventResource',
        'events',
        null=True
    )

    class Meta:
        authentication = DjangoAuthentication()
        authorization = TagAuthorization()
        queryset = Tag.objects.all()
        filtering = {
            "segments": ALL,
            }        

        nested = 'segments'
    
    def create_nested_event(self, obj, nested_obj, request):
        AudioSegmentTaggedEvent.objects.create(
            collection = obj.collection,
            audioSegment = nested_obj,
            tag = obj,
            user = request.user
        )
        return


###
#   Tags for a specific collection.
###
class CollectionTagResource(TagResource):
    class Meta(TagResource.Meta):
        collection = None
        
    def set_collection(self, collection):
        self._meta.collection = collection
    
    ###
    #   Return only tag objects for this collection.
    ###
    def apply_authorization_limits(self, request, object_list):
        if not self._meta.collection:
            raise Exception('Must call set_collection before using this resource')
            
        return super(CollectionTagResource, self).apply_authorization_limits(request, object_list.filter(collection=self._meta.collection))
    
