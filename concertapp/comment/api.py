from concertapp.lib.api import ConcertAuthorization, MyResource, DjangoAuthentication
from concertapp.models import *
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.http import *




###
#   A generic resource for a comment.
###
class CommentResource(MyResource):
    comment = fields.CharField('comment')
    author = fields.ForeignKey('concertapp.users.api.UserResource', 'author', full=True)
    time = fields.DateField('time')
    
    class Meta:
        authentication = DjangoAuthentication()
        authorization = ConcertAuthorization()
        
        queryset = Comment.objects.all()
        
###
#   A resource specifically for a segment comment.
###
class SegmentCommentResource(CommentResource):
    segment = fields.ForeignKey('concertapp.audiosegments.api.AudioSegmentResource', 'segment')
    
    class Meta(CommentResource.Meta):
        queryset = SegmentComment.objects.all()
    
    
###
#   A resource specifically for segment comments from a certain collection.
###
class CollectionSegmentCommentResource(SegmentCommentResource):
    class Meta(SegmentCommentResource.Meta):
        collection = None;
    
    def set_collection(self, col):
        self._meta.collection = col;
        
    ###
    #   Return only SegmentComment objects for a specific collection.
    ###
    def apply_authorization_limits(self, request, object_list):
        if not self._meta.collection:
            raise Exception('Must call set_collection before using this resource.')

        return super(CollectionSegmentCommentResource, self).apply_authorization_limits(request, object_list.filter(collection=self._meta.collection))
    