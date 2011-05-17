###
#   @file   decorators.py
#   Contains custom decorators that can be used on top of views.
#
#   @author Colin Sullivan <colinsul [at] gmail.com>

import sys

from django.core.exceptions import ObjectDoesNotExist
from concertapp.models  import *
from django.http import Http404


###
#   Decorator that checks to make sure the user is a member of the specified
#   collection, and that the collection acutally exists.  This currently requires
#   that the view has a collection_id argument.
#
#   Usage:
#   @user_is_member_and_collection_exists
#   def my_view(request, collection_id)
def user_is_member_and_collection_exists(function=None): 
       
    def _decorator(view_func, *args, **kwargs):
        
        def _view(request, *args, **kwargs):
            
            # Ensure that collection_id argument is in view
            if('collection_id' in kwargs):
                collection_id = kwargs['collection_id']
            else :
                raise Exception('Collection not found')
                
            # get user
            user = request.user

            try:
                # Get specified collection object
                col = Collection.objects.get(id = collection_id)

                # Make sure user is a member 
                col.users.get(id = user.id)
            # If collection didn't exist, or user is not a member, 404
            except ObjectDoesNotExist, e:
                raise Http404()
            
            # Pass col and user variables so we don't have to query for them
            #   again in the controller.
            kwargs['col'] = col
            kwargs['user'] = user
            return view_func(request, **kwargs)
        
        return _view

        
    if function is None:
        return _decorator
    else:
        return _decorator(function)
                
            
            
