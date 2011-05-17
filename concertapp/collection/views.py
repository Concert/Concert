from concertapp.collection.forms import CreateCollectionForm
from concertapp.models import Collection
from django import forms
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.template import RequestContext
from django.utils import simplejson
import json
import sys
from urlparse import parse_qs
from urllib import urlencode


from concertapp.collection.api import *



##
# The manage_collections page, shows what facebook friends have collections, and
# allows you to request to join their collection.  Also has options for creating a 
# collection and inviting your facebook friends to join it.
#
##
@login_required
def manage_collections(request):
    user = request.user
    
    ur = UserRequestResource()
    
    data = {
        'requests': ur.as_dict(request),
    }
    
    

    return TemplateResponse(request, 'collections/manage_collections.html', {
        'page_name': 'Collections',
        'js_page_path': '/collections/',
        'data': data, 
    })


##
#   An ajax request that returns a JSON object of collection names and ids.  This
#   should be enhanced at some point to sort by relevance, etc.
#
#   @param  query        String  - the search query
##
@login_required
def search_collections(request, query):
    user = request.user
    
    # Get exact match if one exists
    try:
        exact = Collection.objects.get(name=query)
        exact = True
    except ObjectDoesNotExist:
        exact = False
            
    #   Create object with properties that we will serialize
    cr = CollectionResource()
    cr.set_search_term(query)
    resultsDicts = cr.as_dict(request)

    #   Serialize results into JSON response        
    return HttpResponse(
        simplejson.dumps({
            'results': resultsDicts, 
            'exact': exact, 
        }),
        content_type = 'application/json'
    )