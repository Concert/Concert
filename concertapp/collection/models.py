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


###
#   A collection is a group of users that manage audio files together.  This is 
#   basically just a group, with an admin user.
###     
class Collection(models.Model):
    name = models.CharField(max_length = 100, unique=True)
    admin = models.ForeignKey(User)
    users = models.ManyToManyField(User, related_name = "collections")

    def __unicode__(self):
        return str(self.name)
        
    ###
    #   When a new collection is created, make CreateCollectionEvent.
    ###
    def save(self, *args, **kwargs):
        # If collection is new
        if not self.pk:
            super(Collection, self).save(*args, **kwargs)

            # If admin is not in users list
            if self.admin not in self.users.all():
                # Add them in there
                self.users.add(self.admin)

            # Create event
            from concertapp.event.models import CreateCollectionEvent
            CreateCollectionEvent.objects.create(user=self.admin, collection=self)
        else:
            super(Collection, self).save(*args, **kwargs)
