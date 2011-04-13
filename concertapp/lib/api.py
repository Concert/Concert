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
import datetime

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
    
    class Meta:
        
        # incase we need to pass around the request in awkward ways.
        request = None
        
        # this attribute should be set to the name of the tastypie field which
        # represents the nested resource
        nested = None
    
    
    ###
    #   This method is used anytime the data needs to be retrieved as a 
    #   python dict.  TODO: Determine if there is a better way to do this.
    ###
    def as_dict(self, request):
        
        # Get objects
        objs = self.get_object_list(request)
        # Get dehydrated bundles
        objsBundles = [self.full_dehydrate(obj=obj) for obj in objs]
        
        ###
        #   A helper function that will get the dicts of any sub-bundles.
        ###
        def get_recursive_bundle_data(attr):
            # If we are looking at a bundle
            if type(attr) == Bundle:
                # We will re-construct all of the attributes as dicts, they
                # are currently either bundles or attributes.
                data = {}
                # For each attribute
                for key in attr.data:
                    # Get bundle data
                    data[key] = get_recursive_bundle_data(attr.data[key])
            # If we are looking at list, must run this function on elements
            elif type(attr) == list:
                data = [get_recursive_bundle_data(x) for x in attr]
            # we are looking at an attribute
            else:
                # If this is a date time attribute
                if type(attr) == datetime.datetime:
                    # Send along as string so json knows how to serialize it
                    data = str(attr)
                else:
                    # just pass it back through recursion, will get serialized later
                    data = attr
                
            return data
        
        # For each of our objects, get dict as mentioned above.
        objsDicts = [get_recursive_bundle_data(bundle) for bundle in objsBundles]

        return objsDicts

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



    #################################
    # Generic nested resource stuff #
    #################################
class NestedResource(MyResource):
    
    def nested_dispatch_list(self, request, **kwargs):
        if "nested_pk" not in kwargs:
            raise Exception('Nested resource views need to be provided with a nested pk (primary key) in order to function')
        
        return self.nested_dispatch('list', request, **kwargs)

    def nested_dispatch_detail(self, request, **kwargs):
        if "nested_pk" not in kwargs:
            raise Exception('Nested resource views need to be provided with a nested pk (primary key) in order to function')
        
        return self.nested_dispatch('detail', request, **kwargs)
    
    def nested_dispatch(self, request_type, request, **kwargs):
        """
        Handles the common operations (allowed HTTP method, authentication,
        throttling, method lookup) surrounding most CRUD interactions.
        """ 
        allowed_methods = getattr(self._meta, "%s_allowed_methods" % request_type, None)
        request_method = self.method_check(request, allowed=allowed_methods)
        
        method = getattr(self, "nested_%s_%s" % (request_method, request_type), None)

        if method is None:
            raise ImmediateHttpResponse(response=HttpNotImplemented())
        
        self.is_authenticated(request)
        self.is_authorized(request)
        self.throttle_check(request)
        
        # All clear. Process the request.
        request = convert_post_to_put(request)
        response = method(request, **kwargs)
        
        # Add the throttled request.
        self.log_throttled_access(request)

        # If what comes back isn't a ``HttpResponse``, assume that the
        # request was accepted and that some action occurred. This also
        # prevents Django from freaking out.
        if not isinstance(response, HttpResponse):
            return HttpAccepted()
        
        return response


    def get_nested_obj_type(self):
        try:
            field_class_name = getattr(self._meta,'nested')
        except AttributeError:
            return None
        
        field_class = getattr(self, field_class_name).to_class()
        field_django_class = field_class._meta.object_class
        
        return field_django_class
    
    
    def nested_post_list(self, request, **kwargs):
        '''
        the view function thats going to handle POST requests to nested resources where the non-nested resource 
        (the latter of the two specified in the URL) is left as a list.
        
        e.g.,
        POSTing to a resource like this /api/nested_resource/nested_pk/resource
        
        note the lack of a primary key for the <italic>regular</italic> resource.
        
        in this case, it is assumed that the resource is being created new, and therefore the nested resoruce
        can just be injected in as a related object, since theres no chance of it overwritting anything.
        '''
        # not sure why the proper HttpResponse isn't propogated automaticall
        # could be because this is tastypie and not django...
        try:
            nested_object = get_object_or_404(self.get_nested_obj_type(),pk=kwargs['nested_pk'])
        except Http404:
            response = HttpResponse()
            response.status_code = 404
            return response
        
        deserialized = self.deserialize(request, request.raw_post_data, format=request.META.get('CONTENT_TYPE', 'application/json'))
        bundle = self.build_bundle(data=dict_strip_unicode_keys(deserialized))
        updated_bundle = self.obj_create(bundle, request=request)
        self.is_valid(bundle, request)
        
        django_related_field = getattr(bundle.obj,self._meta.nested)
        django_related_field.add(nested_object)
        
        self.create_nested_event(bundle.obj, nested_object, request)
        
        # Return a created response, with the entire serialized nested object
        resp = self.create_response(request,
                                    self.full_dehydrate(updated_bundle.obj)
                                    )
        resp['location'] = self.get_resource_uri(updated_bundle)
        resp.code = 201

        return resp                              
    
    def nested_delete_detail(self, request, **kwargs):
        return self.nested_detail('delete', request, **kwargs)
    
    def nested_post_detail(self, request, **kwargs):
        return self.nested_detail('post', request, **kwargs)
    

    def nested_detail(self, function, request, **kwargs):
        '''
        the view function thats going to handle POST requests to nested resource where the non-nested resource
        already exists.
        
        e.g., 
        POSTing to a resource who's url looks like htis /api/nested_resource/nested_pk/resource/pk
        
        in this case, this function should only create the relationship between the two items.  Nothing should be specified in the POST
        arguments
        '''
        
        # not sure why the proper HttpResponse isn't propogated automaticall
        # could be because this is tastypie and not django...
        try:
            nested_item = get_object_or_404(self.get_nested_obj_type(), pk = kwargs['nested_pk'])
            non_nested_item = get_object_or_404(self._meta.object_class, pk = kwargs['pk'])        
        except Http404:
            response = HttpResponse()
            response.status_code = 404
            return response
        
        try:
            non_nested_related_field = getattr(non_nested_item, self._meta.nested)
        except AttributeError, e:
            Exception("Couldn't find attribute %s on %s. Make sure the resource's field name matches the django model's name." % (self._meta.nested, str(type(non_nested_item)))) 
            
        if function == 'post':
            non_nested_related_field.add(nested_item)
            self.create_nested_event(non_nested_item, nested_item, request)
            return HttpCreated(location=self.get_resource_uri(non_nested_item))  
        elif function == 'delete':
            non_nested_related_field.remove(nested_item)
            return HttpAccepted()        
            
        raise Exception("Unknown function: %s" % function)
    

    def remove_api_resource_names(self, url_dict):
        kwargs_subset = super(NestedResource, self).remove_api_resource_names(url_dict)
        
        for key in ['nested_pk', 'nested_resource_name']:
            try:
                del(kwargs_subset[key])
            except KeyError:
                pass
        
        return kwargs_subset    
    
    
    def base_urls(self):
        return [
            url(r"^(?P<resource_name>%s)%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('dispatch_list'), name="api_dispatch_list"),
            url(r"^(?P<resource_name>%s)/schema%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('get_schema'), name="api_get_schema"),
            url(r"^(?P<resource_name>%s)/set/(?P<pk_list>\w[\w;-]*)/$" % self._meta.resource_name, self.wrap_view('get_multiple'), name="api_get_multiple"),
            url(r"^(?P<resource_name>%s)/(?P<pk>\w[\w-]*)%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('dispatch_detail'), name="api_dispatch_detail"),
            ]
    
    
    def override_urls(self):
        try:
            nested_field_name = getattr(self._meta,'nested')
            nested_resource_name = str(getattr(self, nested_field_name).to_class()._meta.resource_name)
        except AttributeError, e:
            return []
        else:
            if nested_field_name == None:
                return []

        override_urls = []
        
        override_urls.extend([
                url(r"^(?P<nested_resource_name>%s)/(?P<nested_pk>\w[\w-]*?)/(?P<resource_name>%s)/(?P<pk>\w[\w-]*?)%s$" % (nested_resource_name, self._meta.resource_name, trailing_slash()), 
                    self.wrap_view('nested_dispatch_detail')),
                url(r"^(?P<nested_resource_name>%s)/(?P<nested_pk>\w[\w-]*?)/(?P<resource_name>%s)%s$" % (nested_resource_name, self._meta.resource_name, trailing_slash()), 
                    self.wrap_view('nested_dispatch_list'))
                ])
        
        return override_urls
