from concertapp.models import *
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.bundle import Bundle
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.exceptions import NotFound, BadRequest, InvalidFilterError, HydrationError, InvalidSortError, ImmediateHttpResponse
from tastypie.http import *
from tastypie.resources import ModelResource, Resource, convert_post_to_put
from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
import sys


###
#   Just make sure that the user is logged into Django
###
class DjangoAuthentication(Authentication):
    """Authenticate based upon Django session"""
    def is_authenticated(self, request, **kwargs):
        return request.user.is_authenticated()


    
class ConcertAuthorization(Authorization):
    def is_authorized(self, request, object=None):
        #   User must be logged in, authentication backend should have set
        #   request.user
        if not hasattr(request, 'user'):
            return False
        
        return True

###
#   This is for things that we need on each resource.
###
class MyResource(ModelResource):
    
    class Meta():
        
        # incase we need to pass around the request in awkward ways.
        request = None
        
        # this attribute should be set to the name of the tastypie field which
        # represents the nested resource
        nested = None


    ###
    #   This method returns the serialized object upon creation, instead of 
    #   just the uri to it.
    ###
    def post_list(self, request, **kwargs):
        deserialized = self.deserialize(request,
                                        request.raw_post_data,
                                        format=request.META.get('CONTENT_TYPE',
                                                                'application/json')
                                        )
        bundle = self.build_bundle(data=dict_strip_unicode_keys(deserialized))
        self.is_valid(bundle, request)
        updated_bundle = self.obj_create(bundle, request=request)
        resp = self.create_response(request,
                                    self.full_dehydrate(updated_bundle.obj)
                                    )
        resp['location'] = self.get_resource_uri(updated_bundle)
        resp.code = 201

        return resp