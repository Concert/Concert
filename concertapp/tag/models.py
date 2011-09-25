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

from concertapp.audiosegment.models import *
from concertapp.collection.models import *

class Tag(models.Model):
    segments = models.ManyToManyField(AudioSegment, related_name = "tags")
    collection = models.ForeignKey(Collection, related_name="tags")
    name = models.CharField(max_length = 100)
    creator = models.ForeignKey(User)

    def __unicode__(self):
        return self.name

    def save(self):
        # to ensure that the tag is unique, we call a full_clean on this model
        # instance, which will call clean(self) bellow
        self.full_clean()

        super(Tag,self).save()
        if not self.pk or not Tag.objects.filter(pk=self.pk):
            event = TagCreatedEvent(tag = self, collection = self.collection)
            event.save()
 
    def clean(self):
        # make sure new tags have unique names 
        if not Tag.objects.filter(pk=self.pk):
            from django.core.exceptions import ValidationError
            if Tag.objects.filter(name = self.name, collection = self.collection):
                raise ValidationError('Tags must have unique names!')
        
#    def delete(self):
#        # Get all segments with this tag
#        segments = self.segments.all()
#        
        # For each segment
#        for segment in segments :
            # If segment only has one tag, it is this one, so we can delete segment
#            if segment.tag_set.count() == 1 :
                # delete segment
#                segment.delete()
        
        #Make all unread TagCreatedEvents read                
#        for event in TagCreatedEvent.objects.filter(tag = self):
#            event.active = False

        #Make all unread TagCommentEvent read
#        for event in TagCommentEvent.objects.filter(tag_comment__tag = self):
#            event.active = False

        # Delete tag using built-in delete method
#        super(Tag, self).delete()