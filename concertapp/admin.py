from concertapp.models import *

from django.contrib import admin
from django.contrib.admin.sites import AdminSite

from django.contrib.auth.models import User

admin_site = AdminSite()

# Manage users
admin_site.register(User)

admin_site.register(Collection)
admin_site.register(Request)
admin_site.register(AudioFile)
admin_site.register(AudioSegment)
admin_site.register(Tag)