from django.db import models

from concertapp.collection.models import Collection

###
#   @class  A base class for `AudioFile` and `AudioSegment` objects.
###
class Audio(models.Model):
    name = models.CharField(max_length = 100)
    collection = models.ForeignKey(Collection, related_name="%(app_label)ss")
    dateModified = models.DateTimeField(auto_now=True, auto_now_add=True)

    class Meta:
        # `Audio` objects should not be instantiated
        abstract = True

