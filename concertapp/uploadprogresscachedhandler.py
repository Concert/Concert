from django.core.files.uploadhandler import FileUploadHandler
from django.core.cache import cache

import sys
class UploadProgressCachedHandler(FileUploadHandler):
    """
    Tracks progress for file uploads.
    The http post request must contain a header or query parameter, 'upload_id'
    which should contain a unique string to identify the upload to be tracked.
    """

    def __init__(self, request=None):
        super(UploadProgressCachedHandler, self).__init__(request)
        self.progress_id = None
        self.cache_key = None
        

    def handle_raw_input(self, input_data, META, content_length, boundary, encoding=None):
        
        self.content_length = content_length
        if 'upload_id' in self.request.GET :
            self.progress_id = self.request.GET['upload_id']
        elif 'upload_id' in self.request.META:
            self.progress_id = self.request.META['upload_id']
        
        if self.progress_id:
            self.cache_key = self.progress_id
            cache.set(self.cache_key, {
                'length': self.content_length,
                'uploaded' : 0,
                'encoding': 'false'
            })
            

    def new_file(self, field_name, file_name, content_type, content_length, charset=None):
        pass

    def receive_data_chunk(self, raw_data, start):

        if self.cache_key:
            
            data = cache.get(self.cache_key)
            data['uploaded'] += self.chunk_size
            cache.set(self.cache_key, data)
        return raw_data
    
    def file_complete(self, file_size):
        pass

    def upload_complete(self):
        if self.cache_key:
            cache.delete(self.cache_key)