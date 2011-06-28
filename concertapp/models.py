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




###
#   A collection join request.  Should be deleted when action is taken.
###
class Request(models.Model):
    REQUEST_STATUS_CHOICES = (
            ('a', 'Approved'),
            ('d', 'Denied'),
            ('p', 'Pending'),
            ('r', 'Revoked')
        )
    user = models.ForeignKey(User)
    collection = models.ForeignKey(Collection)
    status = models.CharField(max_length=1, choices=REQUEST_STATUS_CHOICES, default='p')
    
    def save(self, *args, **kwargs):
        if not self.pk:
            user = self.user
            collection = self.collection

            # Make sure user is not already a member of the collection
            if user in collection.users.all():
                raise Exception('You are already a member of this collection.')

            # See if this request already exists
            try:
                possibleDuplicate = Request.objects.get(user = user, collection = collection)
                raise Exception('Your request to join this group has already been submitted.')
            except ObjectDoesNotExist:
                # If it does not, we are legit
                super(Request, self).save(*args, **kwargs)
                # Create event
                RequestJoinCollectionEvent.objects.create(
                    user=user,
                    collection=collection
                )
        else:
            super(Request, self).save(*args, **kwargs)
            
                
        
    ###
    #   When the request is accepted, we no longer need ourself.
    ###
    def accept(self):
        
        user = self.user
        collection = self.collection
        
        # Add user to group
        collection.users.add(user)
        
        # Create event
        event = JoinCollectionEvent(user = user, collection = collection)
        event.save()
        
        self.delete()
        
    ###
    #   When the request is denied.
    ###
    def deny(self):
        # Create proper event
        event = RequestDeniedEvent(user = self.user, collection = self.collection)
        event.save()
        
        self.delete()
        
    ###
    #   When request is revoked
    ###
    def revoke(self):
        event = RequestRevokedEvent(user = self.user, collection = self.collection)
        event.save()
        
        self.delete()