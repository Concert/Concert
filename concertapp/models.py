from concertapp.audiofile import audioHelpers
from concertapp.settings import MEDIA_ROOT
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.core.files  import File
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import models
from django.db.models.signals import post_save
from django.core.exceptions import ObjectDoesNotExist
import audiotools
import os, tempfile, sys

from concertapp.event.models import *

###
# An extension to the User model accomplished through the Django supported
# AUTH_PROFILE_MODULE.  Each 'ConcertUser' is linked to a django User      
# via a ForeginKey, thus allowing ConcertUser to hold extra attributes,    
# accessable via <User>.get_profile().<ConcertUser>.attribute              
###
class ConcertUser(models.Model):
    user = models.ForeignKey(User, unique = True)
    unreadEvents = models.ManyToManyField(Event)
        
        
    
###
#   This method is called whenever a model is saved.  Depending on which model
#   was saved, we determine wether or not to do things.
###
def concert_post_save_receiver(sender, **kwargs):
    # If a user was saved
    if sender == User:
        user = kwargs['instance']

        # If a user was created
        if kwargs['created']:
            # Create the user's profile
            ConcertUser.objects.create(user = user)
    
###
# create_concert_user is bound to the post_save signal.  So everytime a model 
# object gets saved, the create_concert_user does stuff.
###
post_save.connect(concert_post_save_receiver)