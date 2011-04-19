###
#   This file contains the REST API functionality relating to collections.
###

from concertapp.lib.api import NestedResource, ConcertAuthorization, DjangoAuthentication
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
#   Make sure that the user who is trying to access/modify a request is either
#   the creator of that request, or the administrator of the collection.
###
class RequestAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        
        if super(RequestAuthorization, self).is_authorized(request, object):
            user = request.user
            
            # If we have an object to authenticate
            if object:
                # If the user is the one who made this request
                if user == object.user:
                    return True
                # or the user is the administrator of the collection
                elif user == object.collection.admin:
                    return True
                else:
                    return False
            else:
                # TODO: This is always the case (tastypie issues)
                return True
            
        else:
            # not authorized by django
            return False

###
#   This is the resource that is used for a collection.
###
class CollectionResource(NestedResource):
    users = fields.ManyToManyField(UserResource, 'users', null = True, full=True)
    admin = fields.ForeignKey(UserResource, 'admin')
    events = fields.ManyToManyField(
        'concertapp.event.api.EventResource',
        'events',
        null=True
    )
    # Segments and files will be sent along with the collection
    files = fields.ManyToManyField(
        'concertapp.audio.api.AudioFileResource',
        'files',
        null=True,
        full=True
    )
    segments = fields.ManyToManyField(
        'concertapp.audiosegments.api.AudioSegmentResource',
        'segments',
        null=True,
        full=True
    )
    # Tags also
    tags = fields.ManyToManyField(
        'concertapp.tags.api.TagResource',
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
            'users': ALL,
            'name': ('contains','icontains',)
            }

        nested = 'users'
    
    ###
    #   Used to set the current search term from the outside.  This should not 
    #   be done like this, but our search is not too robust right now in either case.
    ###
    def set_search_term(self, term):
        self._meta.search_term = term
        
        
    ###
    #   Make sure the user is an admin if they are trying to modify or delete the 
    #   collection.
    ###
    def apply_authorization_limits(self, request, object_list):
        if not request:
            return super(CollectionResource, self).apply_authorization_limits(request, object_list)
            
        method = request.META['REQUEST_METHOD']
        
        # If user is just trying to delete or update the collection:
        if method == 'DELETE' or method == 'PUT':
            user = request.user
            # User must be an administrator of the collection
            object_list = super(CollectionResource, self).apply_authorization_limits(request, user.collection_set.filter(admin=user))
  
        else:
            # Filter by search term if there is one
            try:                
                search_term = self._meta.search_term
                if search_term:
                    object_list = super(CollectionResource, self).apply_authorization_limits(request, object_list.filter(name__icontains=self._meta.search_term))
                else:
                    object_list = super(CollectionResource, self).apply_authorization_limits(request, object_list)
            except AttributeError, e:
                object_list = super(CollectionResource, self).apply_authorization_limits(request, object_list)

        return object_list    
        
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
    #   Here, before the object is sent for serialization we will add the 
    #   requests objects for each collection that our user is a member of.
    ###
    def full_dehydrate(self, obj):

        dehydrated = super(MemberCollectionResource, self).full_dehydrate(obj)
        
        # If the user is the administrator of this collection
        if(self._meta.user == obj.admin):
            # Get all requests for this collection
            r = CollectionRequestResource()
            r.set_collection(obj)
            # Add requests to bundle
            dehydrated.data['requests'] = r.as_dict(self._meta.request)

        return dehydrated
    
        
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

    ###
    #   Here, before the object is sent for serialization we will add the 
    #   requests.
    ###
    def full_dehydrate(self, obj):

        dehydrated = super(AdminCollectionResource, self).full_dehydrate(obj)
        
        # Get all requests for this collection
        r = CollectionRequestResource()
        r.set_collection(obj)
        
        dehydrated.data['requests'] = r.as_dict(self._meta.request)
        
        return dehydrated
        
###
#   This resource is for collections that a user has requested to join.
###
class CollectionRequestResource(CollectionResource):
    
    ###
    #   Retrieve only the collections for which the user has sent join requests
    ###
    def apply_authorization_limits(self, request, object_list):
        user = request.user
        
        # Ignore argument, just get collections that user has requested to join
        object_list = super(UserCollectionRequestResource, self).apply_authorization_limits(request, user.collection_join_requests.all())
        
        return object_list
        
        
###
#   This is the resource that is used for a collection request.
###
class RequestResource(MyResource):
    user = fields.ForeignKey(UserResource, 'user')
    collection = fields.ForeignKey(CollectionResource, 'collection')
    status = fields.CharField('status', default='p')

    class Meta:
        queryset = Request.objects.all()

        authorization = RequestAuthorization()
        authentication = DjangoAuthentication()        

    ###
    #   When a request is updated, create event if necessary
    ###
    def obj_update(self, bundle, request=None, **kwargs):
        # Get old and new status
        oldStatus = bundle.obj.status
        newStatus = bundle.data['status']

        # Save
        bundle = super(RequestResource, self).obj_update(bundle, request, **kwargs)
        
        # Determine how request has changed
        if oldStatus is not newStatus:
            
            # If request was revoked
            if oldStatus == 'p' and newStatus == 'r':
                bundle.obj.revoke()
            elif oldStatus == 'p' and newStatus == 'a':
                bundle.obj.accept()
            elif oldStatus == 'p' and newStatus == 'd':
                bundle.obj.deny()
            else:
                raise Exception('Request cannot be changed after status is no longer pending.')

    
        return bundle
            
        


###
#   This is the resource that is used for collection requests from a single
#   user.
###
class UserRequestResource(RequestResource):
    ###
    #   Make sure the user is the one who made the request
    ###
    def apply_authorization_limits(self, request, object_list):
        
        user = request.user
        
        # Here we ignore the incomming argument, and only send forth the
        # requests for this user
        object_list = super(UserRequestResource, self).apply_authorization_limits(request, user.request_set.all())
        
        return object_list
        
###
#   This is a resource that is used for the requests from a single collection.
###
class CollectionRequestResource(RequestResource):
    user = fields.ForeignKey(UserResource, 'user', full=True)
    
    
    class Meta:
        # The collection for which we will retrieve these requests
        collection = None
        
    ###
    #   This must be called before retreving the requests
    ###
    def set_collection(self, collection):
        self._meta.collection = collection
        
    ###
    #   When retrieving the requests, only get those from our specified collection.
    ###
    def apply_authorization_limits(self, request, object_list):
        collection = self._meta.collection
        
        object_list = super(CollectionRequestResource, self).apply_authorization_limits(request, Request.objects.filter(collection=collection))
        
        return object_list
        
