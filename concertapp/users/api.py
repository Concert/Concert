###
#   This file contains the REST api functionality relating to users
###

from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.bundle import Bundle
from concertapp.models import *
from django.contrib.auth.models import User
from concertapp.lib.api import ConcertAuthorization, DjangoAuthentication

from concertapp.lib.api import MyResource

###
#   This field is used on the user model to transparently add stuff from the
#   user profile object into the user resource.
###
class UserProfileManyToManyField(fields.ManyToManyField):
    ###
    #   We will override the dehydrate method so when we're trying to dehydrate
    #   the attribute, if it fails we can check to see if the attribute is in
    #   the user profile instead.
    ###
    def dehydrate(self, bundle):
        try:
            # Use parent's dehydrate method initially
            result = super(UserProfileManyToManyField, self).dehydrate(bundle)
            # If it worked than this attribute was in the User model.
            return result
        except AttributeError:
            # If there was an attribute error, try using our user profile instead
            result = super(UserProfileManyToManyField, self).dehydrate(
                # Create a new bundle with our user profile object instead
                Bundle(obj = bundle.obj.get_profile())
            )
            # If it worked, than the attribute was in the `ConcertUser` model.  If
            # the above line throws an error, then the attribute did not exist in 
            # the `User` model or the `ConcertUser` model.
            return result

class UserResource(MyResource):
    # unreadEvents is actually on the user profile model
    unreadEvents = UserProfileManyToManyField(
        'concertapp.event.api.EventResource',
        'unreadEvents'
    )
    
    class Meta:
        queryset = User.objects.all()
        authentication = DjangoAuthentication()
        authorization = ConcertAuthorization()
        fields = ['id', 'username',]

###
#   This resource is for a single user.
###        
class SingleUserResource(UserResource):
    
    class Meta(UserResource.Meta):
        # The user object
        user = None
    
    ###
    #   Must be called before anything is to be retrieved
    ###
    def set_user(self, user):
        self._meta.user = user
        
    def apply_authorization_limits(self, request, object_list):
        user = self._meta.user
        
        object_list = super(SingleUserResource, self).apply_authorization_limits(request, [user])
        
        return object_list
