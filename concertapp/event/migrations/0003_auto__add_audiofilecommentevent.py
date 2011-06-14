# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'AudioFileCommentEvent'
        db.create_table('event_audiofilecommentevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['AudioFileCommentEvent'])


    def backwards(self, orm):
        
        # Deleting model 'AudioFileCommentEvent'
        db.delete_table('event_audiofilecommentevent')


    models = {
        'audiofile.audiofile': {
            'Meta': {'object_name': 'AudioFile'},
            'collection': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'files'", 'to': "orm['collection.Collection']"}),
            'duration': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '8', 'decimal_places': '2'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mp3': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'ogg': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'uploader': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'wav': ('django.db.models.fields.files.FileField', [], {'max_length': '100'})
        },
        'audiosegment.audiosegment': {
            'Meta': {'object_name': 'AudioSegment'},
            'audioFile': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'segments'", 'to': "orm['audiofile.AudioFile']"}),
            'beginning': ('django.db.models.fields.FloatField', [], {}),
            'collection': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'segments'", 'to': "orm['collection.Collection']"}),
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'end': ('django.db.models.fields.FloatField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'collection.collection': {
            'Meta': {'object_name': 'Collection'},
            'admin': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'}),
            'users': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'collections'", 'symmetrical': 'False', 'to': "orm['auth.User']"})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'event.audiofilecommentevent': {
            'Meta': {'object_name': 'AudioFileCommentEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'event.audiofileuploadedevent': {
            'Meta': {'object_name': 'AudioFileUploadedEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'event.audiosegmentcommentevent': {
            'Meta': {'object_name': 'AudioSegmentCommentEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'event.audiosegmentcreatedevent': {
            'Meta': {'object_name': 'AudioSegmentCreatedEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'event.audiosegmenttaggedevent': {
            'Meta': {'object_name': 'AudioSegmentTaggedEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'event.createcollectionevent': {
            'Meta': {'object_name': 'CreateCollectionEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'event.event': {
            'Meta': {'object_name': 'Event'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'audioFile': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'events'", 'null': 'True', 'to': "orm['audiofile.AudioFile']"}),
            'audioSegment': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'events'", 'null': 'True', 'to': "orm['audiosegment.AudioSegment']"}),
            'collection': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'events'", 'to': "orm['collection.Collection']"}),
            'content': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'eventType': ('django.db.models.fields.IntegerField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'tag': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'events'", 'null': 'True', 'to': "orm['tag.Tag']"}),
            'time': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        },
        'event.joincollectionevent': {
            'Meta': {'object_name': 'JoinCollectionEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'event.leavecollectionevent': {
            'Meta': {'object_name': 'LeaveCollectionEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'event.requestdeniedevent': {
            'Meta': {'object_name': 'RequestDeniedEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'event.requestjoincollectionevent': {
            'Meta': {'object_name': 'RequestJoinCollectionEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'event.requestrevokedevent': {
            'Meta': {'object_name': 'RequestRevokedEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        },
        'tag.tag': {
            'Meta': {'object_name': 'Tag'},
            'collection': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'tags'", 'to': "orm['collection.Collection']"}),
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'segments': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'tags'", 'symmetrical': 'False', 'to': "orm['audiosegment.AudioSegment']"})
        }
    }

    complete_apps = ['event']
