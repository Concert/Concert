from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.template.response import TemplateResponse

from django.utils import simplejson

from concertapp.collection.api import *

##
# The logged in page, what users see when they first log in.
#
# @param    request HTTP Request
##
@login_required
def logged_in_view(request):
    user = request.user
    
    userResource = UserWithCollectionsResource()
    userResource.set_user(user)
#    response.context_data['data']['userData'] = userResource.as_dict(request)[0]
    

    return TemplateResponse(request, 'logged_in/logged_in.html', {
        'page_name': 'Concert',
        'js_page_path': '/',
        'data': {
            # Data for user currently logged in
            'userData': userResource.as_dict(request)[0], 
        }, 
    })
