###
#   This file contains the REST API functionality relating to collections.
###

from concertapp.lib.api import MyResource, ConcertAuthorization, DjangoAuthentication
from concertapp.models import *
from concertapp.users.api import *
#from concertapp.event.api import *
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
from tastypie.constants import ALL
        


###
#   Make sure that the user who is trying to modify the board is the administrator.
###
class CollectionAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        
        if super(CollectionAuthorization, self).is_authorized(request, object):
            #   Get is always allowed, since we're just requesting information about
            #   the collection.
            if request.method == 'GET':
                return True
            
            
            #   If there is an object to authorize
            if object:
                #   Make sure that we're the administrator
                return (request.user == object.admin)
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False
            
###
#   This is the resource that is used for a collection.
###
class CollectionResource(MyResource):
    users = fields.ManyToManyField(UserResource, 'users', null = True, full=True)
    pendingUsers = fields.ManyToManyField(UserResource, 'pendingUsers', null = True, full=True)
    admin = fields.ForeignKey(UserResource, 'admin')
    events = fields.ManyToManyField(
        'concertapp.event.api.EventResource',
        'events',
        null=True,
        full=True
    )
    # Segments and files will be sent along with the collection
    files = fields.ManyToManyField(
        'concertapp.audiofile.api.AudioFileResource',
        'files',
        null=True,
        full=True
    )
    segments = fields.ManyToManyField(
        'concertapp.audiosegment.api.AudioSegmentResource',
        'segments',
        null=True,
        full=True
    )
    # Tags also
    tags = fields.ManyToManyField(
        'concertapp.tag.api.TagResource',
        'tags',
        null=True,
        full=True
    )
    
    class Meta:
        authentication = DjangoAuthentication()
        authorization = CollectionAuthorization()
        queryset = Collection.objects.all()
        
        # For when we need to filter the resource programatically (not sure how to
        # do this otherwise)
        search_term = None
        
        filtering = {
            'name': ('icontains','iexact')
        }

    ###
    #   Make sure the user is an admin if they are trying to modify or delete the 
    #   collection.
    #
    ##def apply_authorization_limits(self, request, object_list):
    #    if not request:
    #        return super(CollectionResource, self).apply_authorization_limits(request, object_list)
            
    #   method = request.META['REQUEST_METHOD']
        
    #    return super(Collection)
        # If user is just trying to delete or update the collection:
    #    if method == 'DELETE' or method == 'PUT':
    #        user = request.user
            # User must be an administrator of the collection
    #        return super(CollectionResource, self).apply_authorization_limits(request, user.collection_set.filter(admin=user))
    #    else:
            # Anyone can get
    #        return super(CollectionResource, self).apply_authorization_limits(request, object_list)
  
        
###
#   This resource is used for serializing a single collection.
###
class SingleCollectionResource(CollectionResource):
    
    class Meta(CollectionResource.Meta):
        #   The collection we are referring to.
        collection = None
    
    ###
    #   Must be called before anything else
    ###
    def set_collection(self, collection):
        self._meta.collection = collection
    
    ###
    #   Only retrieve stuff for this collection
    ###
    def apply_authorization_limits(self, request, object_list):
        collection = self._meta.collection
        
        object_list = super(SingleCollectionResource, self).apply_authorization_limits(request, [collection])
        
        return object_list

###
#   This resource is only for collections which the user is a member of.  This
#   includes collections for which the user is an administrator.
###        
class MemberCollectionResource(CollectionResource):
    
    class Meta:
        # The user which we are referring to.  This must be set before
        #   the collection is to be retrieved.
        user = None
        
        request = None
        
    def set_user(self, user):
        self._meta.user = user
        
    ###
    #   Make sure the user is a member of the collections
    ###
    def apply_authorization_limits(self, request, object_list):
        
        if self._meta.user:
            user = self._meta.user
        else:
            user = request.user
            
        if not self._meta.request:
            self._meta.request = request

        # Here we ignore the incomming argument, and only send forth the
        # collections that the user is a member of.
        object_list = super(MemberCollectionResource, self).apply_authorization_limits(request, user.collections.all())
        
        return object_list
    
    
        
###
#   This resource is for collections which the user is a member, but is not the
#   administrator.
###
class MemberNotAdminCollectionResource(CollectionResource):
    
    ###
    #   Make sure the user is not an admin
    ###
    def apply_authorization_limits(self, request, object_list):
        
        user = request.user
        
        # Here we ignore the incomming argument, and only send forth the
        # collections that the user is a member of.        
        object_list = super(MemberNotAdminCollectionResource, self).apply_authorization_limits(request, user.collection_set.exclude(admin=user))
        
        return object_list
        
###
#   This resource is only for collections which the user is an administrator of.
###
class AdminCollectionResource(CollectionResource):
        
    ###
    #   Retrieve only the collections for which the user is an administrator
    ###
    def apply_authorization_limits(self, request, object_list):
        
        self._meta.request = request
        
        user = request.user
        
        # Again, ignore incomming argument and only send forth the
        # collections that the user is an administrator of.
        object_list = super(AdminCollectionResource, self).apply_authorization_limits(request, user.collection_set.filter(admin=user))
        
        return object_list

        
