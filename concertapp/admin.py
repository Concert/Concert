from django.contrib import admin
from django.contrib.admin.sites import AdminSite

from django.contrib.auth.models import User

admin_site = AdminSite()

# Manage users
admin_site.register(User)

