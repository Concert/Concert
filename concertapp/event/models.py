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

from concertapp.collection.models import *
from concertapp.audiosegment.models import *
from concertapp.audiofile.models import *
from concertapp.tag.models import *

###
# An abstract class (abstract by Concert semantics, not Django) used as a base event
# class.  Not abstract so models can have lists of events (i.e. a `User` can have
# a m2m relationship of unread events)
class Event(models.Model):
    # The time this event occurred
    time = models.DateTimeField(auto_now_add = True)
    # Wether this event is shown to the public or not
    active = models.BooleanField(default=True)
    # The real class
    #realType = models.ForeignKey(ContentType, editable=False, null=True)
    

    # The collection that this event is associated with
    collection = models.ForeignKey(Collection, related_name='events')

    # Every event has a user associated with it, so lets just store it here
    user = models.ForeignKey(User)

    # This event might be related to an `AudioSegment` or an `AudioFile` object
    audioSegment = models.ForeignKey(AudioSegment, related_name='events', null=True)
    audioFile = models.ForeignKey(AudioFile, related_name='events', null=True)

    # The event might also be related to a `Tag` instance
    tag = models.ForeignKey(Tag, related_name='events', null=True)
    
    ###
    #   The possible event types:
    ###
    EVENT_TYPES = (
        (1, 'AudioSegmentCreatedEvent'),
        (2, 'AudioSegmentTaggedEvent'),
        (3, 'AudioFileUploadedEvent'),
        (4, 'JoinCollectionEvent'),
        (5, 'LeaveCollectionEvent'),
        (6, 'CreateCollectionEvent'),
        (7, 'RequestJoinCollectionEvent'),
        (8, 'RequestDeniedEvent'),
        (9, 'RequestRevokedEvent')
    )
    # The type of event that this is
    eventType = models.IntegerField(choices=EVENT_TYPES, null=False)
    
    
    ###
    # Only allow sub classes of Event to be saved, and when saving, determine the 
    # sub class' type and store it in realType (e.g., TagCommentEvent, SegmentCommentEvent,
    # etc.)
    ###
    def save(self, **kwargs):
#        if type(self)==Event:
#            raise Exception('Event is abstract, but not through Django semantics (e.g., \'Class Meta: abstract = True\' is NOT set).\nYou must use one of the Event subclasses')
#        else:
        # Add event to all of this collection's user's unread events
        #self.realType = self._get_real_type()
        super(Event,self).save(kwargs)
        for user in self.collection.users.all():
            user.get_profile().unreadEvents.add(self)

    def _get_real_type(self):
        return ContentType.objects.get_for_model(type(self))

    ###
    # return the sub_class object thats associated with this tuple
    ###
#    def cast(self):
        #return self.realType.get_object_for_this_type(pk=self.pk)

#    def __unicode__(self):
#        return str(self.cast())


###
#   When a user comments on a tag.
###
#class TagCommentEvent(Event):
#    tag_comment = models.ForeignKey("TagComment", related_name = 'comment_event')
    
#    def __unicode__(self):
#        author = self.user
#        tag = self.tag_comment.tag.name

#        return str(author) + " commented on tag '" + str(tag) + "'."


###
#   When a user comments on a segment
###
#class SegmentCommentEvent(Event):
#    segment_comment = models.ForeignKey("SegmentComment", related_name = "comment_event" )

#    def __unicode__(self):
#        author = self.segment_comment.author
#        segment = self.segment_comment.segment.name

#        return str(author) + " commented on segment '" + str(segment) + "'."

###
#   When an audio segment is created.
###
class AudioSegmentCreatedEvent(Event):
    # Set the default event type
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('eventType', 1)
        return super(AudioSegmentCreatedEvent, self).__init__(*args, **kwargs)
    
    def __unicode__(self):
        creator = self.user
        audioSegment = self.audioSegment.name

        return str(creator) + " created segment '" + str(audioSegment) + "'."
    
###
#   When an audio segment has been tagged.
###
class AudioSegmentTaggedEvent(Event):
    # Set the default event type
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('eventType', 2)
        return super(AudioSegmentTaggedEvent, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return str(self.user) + " tagged '" + str(self.audioSegment.name) + "' with tag '" + self.tag.name + "'."

###
#   When an audio file was uploaded
###
class AudioFileUploadedEvent(Event):
    # Set the default event type
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('eventType', 3)
        return super(AudioFileUploadedEvent, self).__init__(*args, **kwargs)
    
    def __unicode__(self):
        return str(self.audioFile.uploader) + " uploaded file '" + self.audioFile.name + "'."

###
#   When a user joins a collection
###
class JoinCollectionEvent(Event):
    # Set the default event type
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('eventType', 4)
        return super(JoinCollectionEvent, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return str(self.user) + " joined " + str(self.collection)        

###
#   When a user leaves a collection
###
class LeaveCollectionEvent(Event):
    # Set the default event type
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('eventType', 5)
        return super(LeaveCollectionEvent, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return str(self.user) + " left " + str(self.collection)        

###
#   When a collection is created.
###
class CreateCollectionEvent(Event):
    # Set the default event type
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('eventType', 6)
        return super(CreateCollectionEvent, self).__init__(*args, **kwargs)
    
    def __unicode__(self):
        return str(self.user) + " created " + str(self.collection)        
    
###
#   When a user requests to join a collection
###
class RequestJoinCollectionEvent(Event):
    # Set the default event type
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('eventType', 7)
        return super(RequestJoinCollectionEvent, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return str(self.user) + " requested to join " + str(self.collection)

###
#   When a user gets denied from a collection.
###
class RequestDeniedEvent(Event):
    # Set the default event type
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('eventType', 8)
        return super(RequestDeniedEvent, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return str(self.user) + " was denied from " + str(self.collection)

###
#   When a user revokes her/his request to join a collection
###
class RequestRevokedEvent(Event):
    # Set the default event type
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('eventType', 9)
        return super(RequestRevokedEvent, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return str(self.user) + " revoked join request from " + str(self.collection)

