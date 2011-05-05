from concertapp.audiosegments.api import AudioSegmentResource
from concertapp.collection.api import CollectionResource, RequestResource 
from concertapp.event.api import *
from concertapp.audio.api import AudioFileResource
from concertapp.tags.api import TagResource
from concertapp.users.api import UserResource
from concertapp.audiosegments.api import AudioSegmentResource

# We can import the views explicitly here because there are only like
# 3 server-side URLS in the entire program.
from concertapp.views import logged_in_view
from concertapp.organize.views import organize_collection

from concertapp.admin import admin_site

from django.conf import settings
from django.conf.urls.defaults import *
from django.views.generic.simple import redirect_to
from tastypie.api import Api
import django.contrib.auth.views
import os

api1 = Api(api_name='1')
api1.register(CollectionResource())
api1.register(UserResource())
api1.register(RequestResource())
api1.register(TagResource())
api1.register(AudioFileResource())
api1.register(AudioSegmentResource())

# Events
api1.register(EventResource())

urlpatterns = patterns('',

    # Login/logout pages
    (r'^login/$', 'concertapp.users.views.login_register'),
    (r'^logout/$', 'django.contrib.auth.views.logout_then_login'),

    # Password
    (r'^reset_password/$', 'django.contrib.auth.views.password_reset',
    {'template_name': 'users/reset_password.html', 
    'post_reset_redirect':'/login/',
    }),

    (r'^reset_pass_confirm/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$', 'django.contrib.auth.views.password_reset_confirm'),

    # The Logged In Page
    url(r'^$', logged_in_view, name='logged_in_view'),

    # collections urls (manage collections and organize audio)
    (r'^collections/', include('concertapp.collection.urls')),

    # audio urls (upload_audio and audio utilities)
    (r'^audio/', include('concertapp.audio.urls')), 

    #   Organize audio (for a collection)
    url(r'organize/collection/(?P<collection_id>[\d]+)/$', organize_collection, name='organize_collection'),
    
    
    # REST api
    (r'^api/', include(api1.urls)),

    # admin
    (r'^admin/', include(admin_site.urls)),
)






if settings.DEBUG:
    urlpatterns += patterns('',
#   Serving audio files with django doesn't work.  Webkit doesn't understand or 
#   something.  Use apache.
#        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {
#            'document_root': settings.MEDIA_ROOT
#        }),
        (r'^js/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'js')
        }),
        (r'^css/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'css')
        }),
        (r'^fonts/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'fonts')
        }),
        (r'^graphics/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'graphics')
        }),
        (r'^paths/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'paths')
        }),
    )
