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

from concertapp.audiofile.models import *

class AudioSegment(models.Model):
    name = models.CharField(max_length = 100)
    beginning = models.FloatField()
    end = models.FloatField()
    audioFile = models.ForeignKey(AudioFile, related_name="segments")
    creator = models.ForeignKey(User)
    collection = models.ForeignKey(Collection, related_name="segments")
    
    def __unicode__(self):
      return self.name

    def __unicode__(self):
        return self.name

    # Make sure it has a unique name (relative to the other segments
    # in the collection)
    def clean(self):
        try:
            # If there is a segment in this collection with the same name
            sameName = AudioSegment.objects.get(
                name = self.name,
                collection = self.collection
            )
            
            # And it is not the current segment
            if sameName.id != self.id:
                raise ValidationError('Audio Segments must have unique names!')
            
        except ObjectDoesNotExist:
            # There is no segment with the same name in this collection.  We're
            # golden.
            pass
            
        
    def tag_list(self):
        tags = self.tag_set.all()
        return ', '.join(tags)
    
    def delete(self):
        from concertapp.event.models import AudioSegmentCreatedEvent, AudioSegmentTaggedEvent
        for event in AudioSegmentCreatedEvent.objects.filter(audioSegment = self):
            event.active = False

        for event in AudioSegmentTaggedEvent.objects.filter(audioSegment = self):
            event.active = False

        super(AudioSegment,self).delete()

