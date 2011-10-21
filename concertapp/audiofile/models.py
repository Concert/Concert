from concertapp.audiofile import audioHelpers
from concertapp.settings import MEDIA_ROOT
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.core.files  import File
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.db.models.signals import post_save
from django.core.exceptions import ObjectDoesNotExist
import audiotools
import os, tempfile, sys

from concertapp.collection.models import *
from concertapp.baseaudio.models import BaseAudio

from concertapp.settings import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET


class AudioFile(BaseAudio):
    # The zoom levels (px per second) for images that will be created.  A directory
    # for each of these numbers should exist in the MEDIA_ROOT/waveforms/ directory
    ZOOM_LEVELS = [10]
    # The height of each waveform image
    WAVEFORM_IMAGE_HEIGHT = 198
    AUDIO_LOCATION = 'audio/'
    uploader = models.ForeignKey(User, related_name="uploadedFiles")

    # The duration of the audio file.  Default is 0
    duration = models.DecimalField(max_digits = 8, decimal_places = 2, default=0)

    # The status of this file
    status = models.CharField(
        max_length=1,
        choices=(
            ('u', 'Uploading'),
            ('p', 'Processing'),
            ('d', 'Done'),
            ('e', 'Error')
        ),
        # File is initially uploading
        default='u'
    )
    # The progress of the current stage
    progress = models.DecimalField(max_digits = 3, decimal_places = 2, default = 0)
    
    def __unicode__(self):
        return self.name


    ###
    #   Delete this audio file object, also removing it from S3
    ###
    def delete(self):
        from concertapp.audiosegment.models import AudioSegment
        logger.info('Opening S3 connection')
        conn = S3Connection(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
        logger.info('Opening "{0}" bucket'.format(S3_BUCKET))
        bucket = conn.get_bucket(S3_BUCKET)

        # TODO: implement and test.

        
        # Remove wav
            
        # Remove ogg
        
        # Remove mp3

        # For each zoom level
        # for zoomLevel in AudioFile.ZOOM_LEVELS:
            # Delete waveform image
            

        # Get all segments who have this audio object as its parent
        # segments = self.segments.all()

        # Delete all of the segments
        # for segment in segments:
            # segment.delete()

        # Should we have a 'deleted' event?
        # for event in AudioFileUploadedEvent.objects.filter(audioFile=self):
            # event.active = False

        # Send delete up.
        return super(AudioFile, self).delete()