from concertapp.audio import audioHelpers
from concertapp.settings import MEDIA_ROOT
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
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
# An extension to the User model accomplished through the Django supported
# AUTH_PROFILE_MODULE.  Each 'ConcertUser' is linked to a django User      
# via a ForeginKey, thus allowing ConcertUser to hold extra attributes,    
# accessable via <User>.get_profile().<ConcertUser>.attribute              
###
class ConcertUser(models.Model):
    user = models.ForeignKey(User, unique = True)
    unread_events = models.ManyToManyField('Event')
        
        
    
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
# An abstract class (abstract by Concert semantics, not Django) used to house
# information for all the events that can occur on the system.  Built for logging
# purpose, not event triggered events, although that functionality could
# theoretically work using django signals.  
### 
class Event(models.Model):
    time = models.DateTimeField(auto_now_add = True)
    collection = models.ForeignKey('Collection')
    active = models.BooleanField(default=True)
    real_type = models.ForeignKey(ContentType, editable=False, null=True)

    ###
    # Only allow sub classes of Event to be saved, and when saving, determine the 
    # sub class' type and store it in real_type (e.g., TagCommentEvent, SegmentCommentEvent,
    # etc.)
    ###
    def save(self, **kwargs):
        if type(self)==Event:
            raise Exception("Event is abstract, but not through Django semantics (e.g., 'Class Meta: abstract = True' is NOT set).\nYou must use one of the Event subclasses")
        else:
            # TODO: Fix this, this should only be users who are a member
            # of the collection of interest.
            self.real_type = self._get_real_type()
            super(Event,self).save(kwargs)
            for user in self.collection.users.all():
                user.get_profile().unread_events.add(self)

    def _get_real_type(self):
        return ContentType.objects.get_for_model(type(self))

    ###
    # return the sub_class object thats associated with this tuple
    ###
    def cast(self):
        return self.real_type.get_object_for_this_type(pk=self.pk)

    def __unicode__(self):
        return str(self.cast())


class TagCommentEvent(Event):
    tag_comment = models.ForeignKey("TagComment", related_name = 'comment_event')

    def __unicode__(self):
        author = self.tag_comment.author
        tag = self.tag_comment.tag.name

        return str(author) + " commented on tag '" + str(tag) + "'."


class SegmentCommentEvent(Event):
    segment_comment = models.ForeignKey("SegmentComment", related_name = "comment_event" )

    def __unicode__(self):
        author = self.segment_comment.author
        segment = self.segment_comment.segment.name

        return str(author) + " commented on segment '" + str(segment) + "'."


class TagCreatedEvent(Event):
    tag = models.ForeignKey("Tag", related_name = "created_event")

    def __unicode__(self):
        creator = self.tag.creator
        tag = self.tag.name
        
        return str(creator) + " created tag '" + str(tag) + "'."


class AudioSegmentCreatedEvent(Event):
    audio_segment = models.ForeignKey("AudioSegment", related_name = "created_event")

    def __unicode__(self):
        creator = self.audio_segment.creator
        audio_segment = self.audio_segment.name

        return str(creator) + " created segment '" + str(audio_segment) + "'."
    

class AudioSegmentTaggedEvent(Event):
    audio_segment = models.ForeignKey("AudioSegment", related_name = "tagged_event")
    tag = models.ForeignKey("Tag", related_name = "tagged_event")
    tagging_user = models.ForeignKey(User, related_name = "tagged_event")

    def __unicode__(self):
        return str(self.tagging_user) + " tagged '" + str(self.audio_segment.name) + "' with tag '" + self.tag.name + "'."


class AudioFileUploadedEvent(Event):
    audioFile = models.ForeignKey("AudioFile", related_name = "audio_uploaded_event")

    def __unicode__(self):
        return str(self.audioFile.uploader) + " uploaded file '" + self.audioFile.name + "'."


class JoinCollectionEvent(Event):
    new_user = models.ForeignKey(User)

    def __unicode__(self):
        return str(self.new_user) + " joined " + str(self.collection)        

class LeaveCollectionEvent(Event):
    old_user = models.ForeignKey(User)

    def __unicode__(self):
        return str(self.new_user) + " left " + str(self.collection)        

###
#   An event that is created when a collection is created.
###
class CreateCollectionEvent(Event):
    admin = models.ForeignKey(User)

    def __unicode__(self):
        return str(self.admin) + " created " + str(self.collection)        
    

class RequestJoinCollectionEvent(Event):
    requesting_user = models.ForeignKey(User)
    
    def __unicode__(self):
        return str(self.requesting_user) + " requested to join " + str(self.collection)
        
class RequestDeniedEvent(Event):
    requesting_user = models.ForeignKey(User)

    def __unicode__(self):
        return str(self.requesting_user) + " was denied from " + str(self.collection)

class RequestRevokedEvent(Event):
    requesting_user = models.ForeignKey(User)

    def __unicode__(self):
        return str(self.requesting_user) + " revoked join request from " + str(self.collection)


class AudioSegment(models.Model):
    name = models.CharField(max_length = 100)
    beginning = models.FloatField()
    end = models.FloatField()
    audioFile = models.ForeignKey('AudioFile')
    creator = models.ForeignKey(User)
    collection = models.ForeignKey('Collection')
    
    def __unicode__(self):
      return self.name

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.full_clean()

        new = False
        if not self.id or not AudioSegment.objects.filter(pk=self.id):
            new = True

        super(AudioSegment, self).save(*args, **kwargs)

        if new:
            event = AudioSegmentCreatedEvent(audio_segment = self, collection = self.collection)
            event.save()
            

    def clean(self):
        # if the audio segment is new, make sure it has a unique name (relative to the other segments
        # in the collection
        if not AudioSegment.objects.filter(pk=self.id):    
            from django.core.exceptions import ValidationError
            if AudioSegment.objects.filter(name = self.name, collection = self.collection):
                raise ValidationError('Audio Segments must have unique names!')
        
    def tag_list(self):
        tags = self.tag_set.all()
        return ', '.join(tags)
    
    def delete(self):
        for event in AudioSegmentCreatedEvent.objects.filter(audio_segment = self):
            event.active = False

        for event in AudioSegmentTaggedEvent.objects.filter(audio_segment = self):
            event.active = False

        super(AudioSegment,self).delete()


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
            CreateCollectionEvent.objects.create(admin=self.admin, collection=self)
        else:
            super(Collection, self).save(*args, **kwargs)

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
                    requesting_user=user,
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
        event = JoinCollectionEvent(new_user = user, collection = collection)
        event.save()
        
        self.delete()
        
    ###
    #   When the request is denied.
    ###
    def deny(self):
        # Create proper event
        event = RequestDeniedEvent(requesting_user = self.user, collection = self.collection)
        event.save()
        
        self.delete()
        
    ###
    #   When request is revoked
    ###
    def revoke(self):
        event = RequestRevokedEvent(requesting_user = self.user, collection = self.collection)
        event.save()
        
        self.delete()

class Tag(models.Model):
    segments = models.ManyToManyField('AudioSegment', related_name = "tags")
    collection = models.ForeignKey('Collection')
    name = models.CharField(max_length = 100)
#    time = models.DateTimeField(auto_now_add = True)
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
        
    def delete(self):
        # Get all segments with this tag
        segments = self.segments.all()
        
        # For each segment
        for segment in segments :
            # If segment only has one tag, it is this one, so we can delete segment
            if segment.tag_set.count() == 1 :
                # delete segment
                segment.delete()
        
        #Make all unread TagCreatedEvents read                
        for event in TagCreatedEvent.objects.filter(tag = self):
            event.active = False

        #Make all unread TagCommentEvent read
        for event in TagCommentEvent.objects.filter(tag_comment__tag = self):
            event.active = False

        # Delete tag using built-in delete method
        super(Tag, self).delete()


###
# A Concert-abstract (as oppsoed to django abstract) Super class for all the comment types
###
class Comment(models.Model):
    comment = models.TextField()
    author = models.ForeignKey(User)
    time = models.DateTimeField(auto_now_add = True)

    def save(self, **kwargs):
        if type(self)==Comment:
            raise Exception("Comment is abstract, but not through Django semantics (e.g., 'Class Meta: abstract = True' is NOT set ).\nYou must use one of the Comment subclasses")
        else:
            self.real_type = self._get_real_type()
            super(Comment,self).save(kwargs)
            
    def delete(self):
        if type(self)==Comment:
            raise Exception("Comment is abstract, but not through Django semantics (e.g., 'Class Meta: abstract = True' is NOT set ).\nYou must use one of the Comment subclasses")
        else:
            super(Comment,self).delete()            
    
            
    def _get_real_type(self):
        return ContentType.objects.get_for_model(type(self))

    ###
    # return the sub_class object thats associated with this tuple
    ###
    def cast(self):
        return self.real_type.get_object_for_this_type(pk=self.pk)
    
    def __unicode__(self):
        return str(cast(self))


class TagComment(Comment):
    tag = models.ForeignKey('Tag')

    def __unicode__(self):
        return "Tag Comment: " + self.comment[:10] + "..."

    def init(self):
        event = TagCommentEvent(tag_comment = self,collection = self.tag.collection)
        event.save()

    def delete(self, **kwargs):
        for event in TagCommentEvent.objects.filter(tag=self.tag):
            event.active = False

        super(TagComment,self).delete(kwargs)
    

class SegmentComment(Comment):
    segment = models.ForeignKey('AudioSegment', related_name='comments')

    def __unicode__(self):
        return "Segment Comment: " + self.comment[:10] + "..."

    def init(self):
        event = SegmentCommentEvent(segment_comment = self,collection = self.segment.collection)
        event.save()

    def delete(self):
        for event in SegmentCommentEvent.objects.filter(segment=self.segment):
            event.active = False

        super(SegmentComment,self).delete()
    

class AudioFile(models.Model):
    # The zoom levels (px per second) for images that will be created.  A directory
    # for each of these numbers should exist in the MEDIA_ROOT/waveforms/ directory
    ZOOM_LEVELS = [10]
    # The height of each waveform image
    WAVEFORM_IMAGE_HEIGHT = 198
    WAVEFORM_LOCATION = 'waveforms/'
    AUDIO_LOCATION = 'audio/'
    name = models.CharField(max_length = 100)
    uploader = models.ForeignKey(User)
    collection = models.ForeignKey('Collection')
    wav = models.FileField(upload_to = AUDIO_LOCATION)
    ogg = models.FileField(upload_to = AUDIO_LOCATION)
    mp3 = models.FileField(upload_to = AUDIO_LOCATION)
    # The duration of the audio file.  Default is 0
    duration = models.DecimalField(max_digits = 8, decimal_places = 2, default=0)
    
    def __unicode__(self):
        return self.name

    ###
    #   Do everything necessary when an audio object is first created.
    #   
    #   @param  f        File object from request.FILES
    #
    #   @throws     audiotools.EncodingError - upon encoding error
    #   @throws     probably other stuff.
    def save(self, f = None, *args, **kwargs):
        # if we're updating not initializing
        if self.pk:
            return super(AudioFile,self).save(*args,**kwargs)
            
        # Get original filename of uploaded file
        name = str(f)
        self.name = name
        
        # Save ourself so we can get an id for the filename
        super(AudioFile, self).save(*args, **kwargs)
        
        # Using this AudioFile object's id, create filenames
        idString = str(self.id)
        wavName = idString+'.wav'
        oggName = idString+'.ogg'
        mp3Name = idString+'.mp3'
        

        # grab the path of the temporary uploaded file.  This is where the user's
        #   uploaded file exists currently.
        inputFilePath = f.temporary_file_path()
        
        
        #   Create files with dummy contents but with proper names.
        self.wav.save(wavName, SimpleUploadedFile(wavName, 'temp contents'), save = False)
        self.ogg.save(oggName, SimpleUploadedFile(oggName, 'temp contents'), save = False)
        self.mp3.save(mp3Name, SimpleUploadedFile(mp3Name, 'temp contents'), save = False)
        
        #   Now we placeholders for the audio files.
        
        # The input is the temporary uploaded file location
        wavInput = f.temporary_file_path()
        # output was determined above
        wavOutput = os.path.join(MEDIA_ROOT, self.wav.name)

        #   the ogg file will be encoded from the normalized wav file
        oggInput = wavOutput
        oggOutput = os.path.join(MEDIA_ROOT, self.ogg.name)
                
        #   and so will the mp3
        mp3Input = wavOutput
        mp3Output = os.path.join(MEDIA_ROOT, self.mp3.name)

        #   now overwrite the dummy files with the actual encodes
        
        # We will first normalize the wav file (convert to proper sample rate,
        #   etc). NOTE: this doesn't actually mean "normalize" to 0db, but 
        #   hopefully in the future.
        audioHelpers.toNormalizedWav(wavInput, wavOutput)
        
        #   Do the same for ogg
        audioHelpers.toOgg(oggInput, oggOutput)
        
        #   and mp3
        audioHelpers.toMp3(mp3Input, mp3Output)
        
        # Generate the waveform onto disk
        self._generate_waveform()
        
        # Save duration of audio file in seconds
        self.duration = audioHelpers.getLength(wavOutput)

        super(AudioFile, self).save(*args, **kwargs)
        
        event = AudioFileUploadedEvent(audioFile = self, collection = self.collection)
        event.save()
        
        
    # Delete the current audio file from the filesystem
    def delete(self):
        
        # Remove wav from this object, and delete file on filesystem.
        if(self.wav and os.path.exists(self.wav.name)):
            # These lines should delete the files, but i'm getting an error that
            #   I don't understand.
            #self.wav.delete(save=False)
            
            #   So instead, lets just delete the file manually.
            os.unlink(self.wav.name)
            
        # Remove ogg
        if(self.ogg and os.path.exists(self.ogg.name)):
            #self.ogg.delete(save=False)
            os.unlink(self.ogg.name)
        
        # Remove mp3
        if(self.mp3 and os.path.exists(self.mp3.name)):
            #self.mp3.delete(save=False)
            os.unlink(self.mp3.name)

        # For each zoom level
        for zoomLevel in AudioFile.ZOOM_LEVELS:
            # Path to waveform image for this zoom level
            waveformPath = self._get_waveform_path(zoomLevel)
            # If image exists at this zoom level
            if(os.path.exists(waveformPath)):
                # Remove it
                os.unlink(waveformPath)
            

        # Get all segments who have this audio object as its parent
        segments = AudioSegment.objects.filter(audioFile = self)

        # Delete all of the segments
        for segment in segments:
            segment.delete()

        for event in AudioFileUploadedEvent.objects.filter(audioFile=self):
            event.active = False

        # Send delete up if necessary.  This will not happen if the audio object
        #   has not called save()
        if(self.id):
            super(AudioFile, self).delete()

    ###
    #   Return a path to a waveform image for this AudioFile object at a given
    #   zoom level.
    #   
    #   @param  {Number}    zoomLevel    -  The given zoom level.
    ###
    def _get_waveform_path(self, zoomLevel):
        return os.path.join(
            MEDIA_ROOT, AudioFile.WAVEFORM_LOCATION, str(zoomLevel), str(self.id)+'.png'
        )

    ##
    # Generate all the waveforms for this audio object.  
    #
    def _generate_waveform(self):
        # Relative path to our wave file (from MEDIA_ROOT)
        wavPath = self.wav.name
        # Absolute path to our wave file
        wavPathAbsolute = os.path.join(MEDIA_ROOT, wavPath)
        
        idString = str(self.id)
        
        # Get length of audio (samples)
        length = audioHelpers.getLength(wavPathAbsolute)        

        # For each zoom level
        for zoomLevel in AudioFile.ZOOM_LEVELS:
            # Path to the image for the waveform at this zoom level
            waveformPath = self._get_waveform_path(zoomLevel)
            audioHelpers.generateWaveform(
                # from this wave file
                wavPathAbsolute, 
                # put waveform here
                waveformPath, 
                # At zoomLevel px per second (width)
                zoomLevel * length, 
                # Height
                AudioFile.WAVEFORM_IMAGE_HEIGHT
            )
