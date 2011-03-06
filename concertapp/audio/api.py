from concertapp.lib.api import *
from concertapp.models import AudioFile
from concertapp.users.api import *
from concertapp.collection.api import CollectionResource
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.http import *

###
#   Make sure that the user who is trying to modify the board is the administrator.
###
class AudioFileAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        
        if super(AudioFileAuthorization, self).is_authorized(request, object):
            
            #   If there is an object to authorize
            if object:
                #   Make sure that the person modifying is in the collection that the audioFile object
                #   belongs to.
                return (request.user in object.collection.users.all())
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False

class AudioFileResource(MyResource):
    name = fields.CharField('name')
    uploader = fields.ForeignKey(UserResource, 'uploader', full=True)
    collection = fields.ForeignKey(CollectionResource, "collection")
    detailWaveform = fields.FileField('detailWaveform')
    overviewWaveform = fields.FileField('overviewWaveform')
    mp3 = fields.FileField('mp3')
    ogg = fields.FileField('ogg')

    class Meta:
        authentication = DjangoAuthentication()
        authorization = AudioFileAuthorization()
        
        queryset = AudioFile.objects.all()        

        allowed_methods = ['get','put','delete']
    
        excludes = ['wav']

###
#   Only retrieve audioFile objects from a single collection.  Used for bootstrapping.
###
class CollectionAudioFileResource(AudioFileResource):
    
    class Meta(AudioFileResource.Meta):
        collection = None
    
    def set_collection(self, collection):
        self._meta.collection = collection
    
    ###
    #   Return only audioFile objects for a specific collection.
    ###
    def apply_authorization_limits(self, request, object_list):
        if not self._meta.collection:
            raise Exception('Must call set_collection before using this resource.')
            
        return super(CollectionAudioFileResource, self).apply_authorization_limits(request, object_list.filter(collection=self._meta.collection))
        




        