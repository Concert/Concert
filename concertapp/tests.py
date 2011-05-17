from concertapp.models import *
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpRequest
from django.test import TestCase as DjangoTestCase
import json
import random, string, os
import unittest

###
#   Here we will test the API for requests (not yet working because authorization)
#   in tastypie is pooped
###
class APITestCase(DjangoTestCase):

    def setUp(self):
        self.adminUser = User.objects.create_user('test_user', 'testemail@somewhere.com', 'test_user')
        
        self.collection = Collection.objects.create(name='test_collection', admin=self.adminUser)
        
        self.requestingUser = User.objects.create_user('test_user2', 'testemail2@somewhere.com', 'test_user2')

        self.api_prefix = '/api/1/'

        #self.request = self.collection.add_request(self.requestingUser)

    # def testCollection(self):
    #     # login as collection administrator
    #     resp = self.client.login(username='test_user', password='test_user')
        
    #     # Make sure administrator is a member of collection
    #     self.assertTrue(self.adminUser in self.collection.users.all())
        
        
    #     #self.assertEqual(resp, True)

    #     # collection administrator should be able to view request
    #     #resp = self.client.get('/api/1/request/'+str(self.request.id)+'/', data={'format': 'json'})
    #     # Should be allowed because user2 made the request
    #     #self.assertEqual(resp.status_code, 200)
        
    #     # Make sure we can access user list through nested resource
    #     resp = self.client.get(self.api_prefix+'collection/'+str(self.collection.pk)+'/users/')
    #     self.assertEqual(resp.status_code, 200, 'Can\'t view list of users through nested resource.')
    
    #     # Test adding a user through the nested resource
    #     newUser = User.objects.create_user('test_user3', 'testemail3@somewhere.com', 'test_user3')
    #     resp = self.client.post(self.api_prefix+'collection/'+str(self.collection.pk)+'/users/',
    #         json.dumps({
    #             'id': str(newUser.pk), 
    #             'username': newUser.username
    #         }), content_type = 'application/json')
    #     self.assertEqual(resp.status_code, 200, 'Can\'t modify nested resource.') # Make sure user was added to list
        
    #     # Double make sure user was added to list by checking collection's users
    #     self.collection = Collection.objects.get(pk = self.collection.pk)
    #     print "self.collection.users.all():\n"+str(self.collection.users.all())
    #     self.assertTrue(newUser in self.collection.users.all())
        
        

    def testTag(self):                
        #############################
        # Testing Tag functionality  #
        # TODO: Test proper authorization #
        #############################

        # login as collection administrator
        resp = self.client.login(username='test_user', password='test_user')
        
        # tag not created yet
        resp = self.client.get(os.path.join(self.api_prefix, "tag/1/"))
        self.assertEqual(resp.status_code, 410) #make sure API doesn't return anything 
        self.assertQuerysetEqual(Tag.objects.filter(pk=1),[]) #make sure there truely isn't anything to return   

        # create a tag
        resp = self.client.post(os.path.join(self.api_prefix, "tag/"), 
                                data = '{"name":"new_tag","creator":"/api/1/user/1/","collection":"/api/1/collection/1/"}',
                                content_type = 'application/json')
        self.assertEqual(resp.status_code, 200) #make sure API created tag
        try:
            Tag.objects.get(name = "new_tag")
        except Tag.DoesNotExist:
            self.fail("tag wasn't created")

        # try and grab the created tag
        resp = self.client.get(os.path.join(self.api_prefix, "tag/1/"))
        self.assertEqual(resp.status_code, 200) #make sure API gets the created tag
        
        
        #modify a tag
        old_tag_id = Tag.objects.get(name='new_tag').pk
        resp = self.client.put(os.path.join(self.api_prefix, "tag/1/"),
                               data = '{"name":"new_tag_new_name","id":1, "collection":"/api/1/collection/1/","creator":"/api/1/user/1/"}',
                               content_type = 'application/json')
        self.assertEqual(resp.status_code, 204)
        self.assertEqual(len(Tag.objects.filter(name = "new_tag", pk = old_tag_id)),0)
        self.assertEqual(len(Tag.objects.filter(name = "new_tag_new_name", pk = old_tag_id)),1)
        

        #delete a tag
        resp = self.client.delete(os.path.join(self.api_prefix, "tag/1/"))
        self.assertEqual(resp.status_code, 204)
        self.assertQuerysetEqual(Tag.objects.filter(pk=1),[]) #make sure there truely isn't anything to return

    def testAudio(self):
        # login as collection administrator
        resp = self.client.login(username='test_user', password='test_user')
        
        # audio obj not created yet
        resp = self.client.get(os.path.join(self.api_prefix, "audiofile/1/"))
        self.assertEqual(resp.status_code, 410) #make sure API doesn't return anything 
        
        self.assertQuerysetEqual(AudioFile.objects.filter(pk=1),[]) #make sure there truely isn't anything to return   

        # TODO: Until there is a clean, production worthy method for uploading files via REST (tastypie)
        # creating audio objects will be done non-restfully.
        resp = self.client.post(os.path.join(self.api_prefix, "audiofile/"), 
                                data = "{'garbage':'json'}",
                                content_type = 'application/json')
        self.assertEqual(resp.status_code, 405) #make sure POST isn't supported by the API
        
        #Create an audio obj through a view 
        audio_file = open('./test_audio_files/beer.wav')
        resp = self.client.post('/audio/upload/', data = {'audio':audio_file,'collection_id':1})
        self.assertEqual(resp.status_code, 200) # audio created
        
        # try and get the created audio obj
        resp = self.client.get(os.path.join(self.api_prefix, "audiofile/1/"))
        self.assertEqual(resp.status_code, 200) #make sure API gets the created audio obj

        #modify an audio obj
        resp = self.client.put(os.path.join(self.api_prefix, "audiofile/1/"),
                               data = '{"name":"new_audio_new_name", "id":1, "collection":"/api/1/collection/1/","uploader":"/api/1/user/1/"}',
                               content_type = 'application/json')

        self.assertEqual(resp.status_code, 204)
        self.assertEqual(len(AudioFile.objects.filter(name = "new_audio")),0)
        self.assertEqual(len(AudioFile.objects.filter(name = "new_audio_new_name")),1)

        #delete an audio obj
        resp = self.client.delete(os.path.join(self.api_prefix, "audiofile/1/"))
        self.assertEqual(resp.status_code, 204)
        self.assertQuerysetEqual(AudioFile.objects.filter(pk=1),[]) #make sure there truely isn't anything to return


    def testAudioSegment(self):                
        #############################
        # Testing Tag functionality  #
        # TODO: Test proper authorization #
        #############################


        # login as collection administrator
        resp = self.client.login(username='test_user', password='test_user')
        
        # audio segment not created yet
        resp = self.client.get(os.path.join(self.api_prefix, "audiosegment/1/"))
        self.assertEqual(resp.status_code, 410) #make sure API doesn't return anything 
        self.assertQuerysetEqual(Tag.objects.filter(pk=1),[]) #make sure there truely isn't anything to return   


        # create an audio obj for the to-be audio segment
        audio_file = open('./test_audio_files/beer.wav')
        resp = self.client.post('/audio/upload/', data = {'audio':audio_file,'collection_id':1})
        self.assertEqual(resp.status_code, 200)
        audio_id = AudioFile.objects.get(name = 'beer.wav').pk

        # create an audiosegment
        resp = self.client.post(os.path.join(self.api_prefix, "audiosegment/"), 
                                data = '{"name":"new_audio_segment","creator":"/api/1/user/1/","beginning":"1","end":"5","audioFile":"/api/1/audiofile/%s/","collection":"/api/1/collection/1/"}' % audio_id,
                                content_type = 'application/json')

        self.assertEqual(resp.status_code, 200) #make sure API created audio segment

        try:
            AudioSegment.objects.get(name = "new_audio_segment")
        except AudioSegment.DoesNotExist:
            self.fail("audiosegment wasn't created")

        # try and grab the created tag
        resp = self.client.get(os.path.join(self.api_prefix, "audiosegment/1/"))
        self.assertEqual(resp.status_code, 200) #make sure API gets the created audiosegment
        
        #modify a audio segment
        old_audiosegment_id = AudioSegment.objects.get(name='new_audio_segment').pk
        resp = self.client.put(os.path.join(self.api_prefix, "audiosegment/1/"),
                               data = '{"name":"new_audio_segment_new_name","creator":"/api/1/user/1/","beginning":"1","end":"5","audioFile":"/api/1/audiofile/1/","collection":"/api/1/collection/1/"}',
                               content_type = 'application/json')
        self.assertEqual(resp.status_code, 204)
        self.assertEqual(len(AudioSegment.objects.filter(name = "new_audio_segment", pk = old_audiosegment_id)),0)
        self.assertEqual(len(AudioSegment.objects.filter(name = "new_audio_segment_new_name", pk = old_audiosegment_id)),1)
        
        #delete a audio segment
        resp = self.client.delete(os.path.join(self.api_prefix, "audiosegment/1/"))
        self.assertEqual(resp.status_code, 204)
        self.assertQuerysetEqual(AudioSegment.objects.filter(pk=1),[]) #make sure there truely isn't anything to return




    def testNestedSegments(self):

        # login as collection administrator
        resp = self.client.login(username='test_user', password='test_user')
        
        # create an audio obj for the to-be audio segment
        audio_file = open('./test_audio_files/beer.wav')
        resp = self.client.post('/audio/upload/', data = {'audio':audio_file,'collection_id':1})


        
        # create a tag
        resp = self.client.post(os.path.join(self.api_prefix, "tag/"), 
                                data = '{"name":"new_tag","creator":"/api/1/user/1/","collection":"/api/1/collection/1/"}',
                                content_type = 'application/json')
        self.assertEqual(resp.status_code, 200) #make sure API created tag
        try:
            the_tag = Tag.objects.get(name = "new_tag")
        except Tag.DoesNotExist:
            self.fail("tag wasn't created")


        # create a segment
        resp = self.client.post(os.path.join(self.api_prefix, "audiosegment/"), 
                                data = '{"name":"new_audio_segment","creator":"/api/1/user/1/","beginning":"1","end":"5", "audioFile":"/api/1/audiofile/1/","collection":"/api/1/collection/1/"}',
                                content_type = 'application/json')
        self.assertEqual(resp.status_code, 200) #make sure API created tag
        try:
            the_seg = AudioSegment.objects.get(name = "new_audio_segment")
        except Tag.DoesNotExist:
            self.fail("audiosegment wasn't created")


        # at this point there exists a tag and an audio segment. lets link them
        #
        # this tests the method by which you specify both the nested and non-nested resources primary 
        # keys in the uri, post to that uri, and the link happens automatically.
        resp = self.client.post(os.path.join(self.api_prefix,'audiosegment/%s/tag/%s/' % (the_seg.pk, the_tag.pk)))
        self.assertEqual(resp.status_code, 201)
        self.assertIn(the_seg, the_tag.segments.all())


        
        # lets try and create a new tag and link it simultaneously
        #
        # to do the above, we post to a uri that only specifies the nested resources' primary key 
        # (the first mentioned resource in the uri) and then provide a JSON object for the (regular, primary) resource
        resp = self.client.post(os.path.join(self.api_prefix,'audiosegment/%s/tag/' % the_seg.pk),
                                data = '{"name":"new_tag_2","creator":"/api/1/user/1/","collection":"/api/1/collection/1/"}',
                                content_type = 'application/json')
        self.assertEqual(resp.status_code, 201)
        try:
            the_tag_2 = Tag.objects.get(name = "new_tag_2")
        except Tag.DoesNotExist:
            self.fail("Tag didn't get created")
        self.assertIn(the_seg, the_tag_2.segments.all())


        # try and delete the relationship between two items
        resp = self.client.delete(os.path.join(self.api_prefix,'audiosegment/%s/tag/%s/' % (the_seg.pk, the_tag_2.pk)))
        self.assertEqual(resp.status_code, 204)
        try:
            the_tag_2 = Tag.objects.get(name = "new_tag_2")
        except Tag.DoesNotExist:
            self.fail("Tag got deleted, when only the relationship between the tag and audiosegment should've been")
        self.assertNotIn(the_seg, the_tag_2.segments.all())
        self.assertIn(the_seg,the_tag.segments.all())

        
        
        
    def testNestedTags(self):
        # login as collection administrator
        resp = self.client.login(username='test_user', password='test_user')
        
        # create an audio obj for the to-be audio segment
        audio_file = open('./test_audio_files/beer.wav')
        resp = self.client.post('/audio/upload/', data = {'audio':audio_file,'collection_id':1})


        
        # create a tag
        resp = self.client.post(os.path.join(self.api_prefix, "tag/"), 
                                data = '{"name":"new_tag","creator":"/api/1/user/1/","collection":"/api/1/collection/1/"}',
                                content_type = 'application/json')
        self.assertEqual(resp.status_code, 200) #make sure API created tag
        try:
            the_tag = Tag.objects.get(name = "new_tag")
        except Tag.DoesNotExist:
            self.fail("tag wasn't created")


        # create a segment
        resp = self.client.post(os.path.join(self.api_prefix, "audiosegment/"), 
                                data = '{"name":"new_audio_segment","creator":"/api/1/user/1/","beginning":"1","end":"5", "audioFile":"/api/1/audiofile/1/", "collection":"/api/1/collection/1/"}',
                                content_type = 'application/json')
        self.assertEqual(resp.status_code, 200) #make sure API created tag
        try:
            the_seg = AudioSegment.objects.get(name = "new_audio_segment")
        except AudioSegment.DoesNotExist:
            self.fail("audiosegment wasn't created")


        # at this point there exists a tag and an audio segment. lets link them
        #
        # this tests the method by which you specify both the nested and non-nested resources primary 
        # keys in the uri, post to that uri, and the link happens automatically.
        resp = self.client.post(os.path.join(self.api_prefix,'tag/%s/audiosegment/%s/' % (the_seg.pk, the_tag.pk)))
        self.assertEqual(resp.status_code, 201)
        self.assertIn(the_tag, the_seg.tags.all())


        
        # lets try and create a newaudiosegment  and link it simultaneously
        #
        # to do the above, we post to a uri that only specifies the nested resources' primary key 
        # (the first mentioned resource in the uri) and then provide a JSON object for the (regular, primary) resource
        resp = self.client.post(os.path.join(self.api_prefix,'tag/%s/audiosegment/' % the_tag.pk),
                                data = '{"name":"new_audio_segment_2","creator":"/api/1/user/1/","beginning":"1","end":"5", "audioFile":"/api/1/audiofile/1/", "collection":"/api/1/collection/1/"}',
                                content_type = 'application/json')
        self.assertEqual(resp.status_code, 201)
        try:
            the_seg_2 = AudioSegment.objects.get(name = "new_audio_segment_2")
        except AudioSegment.DoesNotExist:
            self.fail("AudioSegment didn't get created")
        self.assertIn(the_tag, the_seg_2.tags.all())


        # try and delete the relationship between two items
        resp = self.client.delete(os.path.join(self.api_prefix,'tag/%s/audiosegment/%s/' % (the_tag.pk, the_seg_2.pk)))
        self.assertEqual(resp.status_code, 204)
        try:
            the_seg_2 = AudioSegment.objects.get(name = "new_audio_segment_2")
        except AudioSegment.DoesNotExist:
            self.fail("Audiosegment got deleted, when only the relationship between the tag and audiosegment should've been")
        self.assertNotIn(the_tag, the_seg_2.tags.all())
        self.assertIn(the_tag,the_seg.tags.all())



    def testNestedUsers(self):
        # login as collection administrator
        resp = self.client.login(username='test_user', password='test_user')
        
        # create a collection
        resp = self.client.post(os.path.join(self.api_prefix, "collection/"), 
                                data = '{"name":"newest_col","admin":"/api/1/user/1/"}',
                                content_type = 'application/json')
        self.assertEqual(resp.status_code, 200) #make sure API created tag
        try:
            the_col = Collection.objects.get(name = "newest_col")
        except Tag.DoesNotExist:
            self.fail("Collection wasn't created")

        # create a user
        User(username="adam_g_2").save()
        the_user = User.objects.get(username="adam_g_2")

        
        # at this point there exists a new user and a new collection. lets link them
        #
        # this tests the method by which you specify both the nested and non-nested resources primary 
        # keys in the uri, post to that uri, and the link happens automatically.
        resp = self.client.post(os.path.join(self.api_prefix,'user/%s/collection/%s/' % (the_user.pk, the_col.pk)))
        self.assertEqual(resp.status_code, 201)
        self.assertIn(the_user, the_col.users.all())


        
        # lets try and create a new collection and link it to a user simultaneously
        #
        # to do the above, we post to a uri that only specifies the nested resources' primary key 
        # (the first mentioned resource in the uri) and then provide a JSON object for the (regular, primary) resource
        resp = self.client.post(os.path.join(self.api_prefix,'user/%s/collection/' % the_user.pk),
                                data = '{"name":"newest_collection_evar","admin":"/api/1/user/1/"}',
                                content_type = 'application/json')
        self.assertEqual(resp.status_code, 201)
        try:
            the_col_2 = Collection.objects.get(name = "newest_collection_evar")
        except Collection.DoesNotExist:
            self.fail("Colleciton didn't get created")
        self.assertIn(the_user, the_col_2.users.all())


        # try and delete the relationship between two items
        resp = self.client.delete(os.path.join(self.api_prefix,'user/%s/collection/%s/' % (the_user.pk, the_col_2.pk)))
        self.assertEqual(resp.status_code, 204)
        try:
            the_col_2 = Collection.objects.get(name = "newest_collection_evar")
        except Collection.DoesNotExist:
            self.fail("Collection got deleted, when only the relationship between the tag and audiosegment should've been")
        self.assertNotIn(the_user, the_col_2.users.all())
        self.assertIn(the_user,the_col.users.all())
