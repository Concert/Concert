import os
from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings

admin.autodiscover()

urlpatterns = patterns('concertapp.audio.views',
    # Upload_audio
    url(r'^upload/$', 'upload_audio', name='upload_audio'),
    # reserve a unique upload_id
    url(r'^upload/get_id/$', 'upload_id', name='upload_id'),
    # Get upload progress
    url(r'^upload/progress/(?P<upload_id>[\d\w]+)$', 'get_upload_progress', name='get_upload_progress')
)
