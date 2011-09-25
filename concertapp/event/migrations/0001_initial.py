# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Event'
        db.create_table('event_event', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('time', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('active', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(related_name='events', to=orm['auth.User'])),
            ('comment', self.gf('django.db.models.fields.TextField')(null=True)),
            ('eventType', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal('event', ['Event'])

        # Adding model 'TagCommentEvent'
        db.create_table('event_tagcommentevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['TagCommentEvent'])

        # Adding model 'AudioSegmentCommentEvent'
        db.create_table('event_audiosegmentcommentevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['AudioSegmentCommentEvent'])

        # Adding model 'AudioFileCommentEvent'
        db.create_table('event_audiofilecommentevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['AudioFileCommentEvent'])

        # Adding model 'AudioSegmentCreatedEvent'
        db.create_table('event_audiosegmentcreatedevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['AudioSegmentCreatedEvent'])

        # Adding model 'AudioSegmentTaggedEvent'
        db.create_table('event_audiosegmenttaggedevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['AudioSegmentTaggedEvent'])

        # Adding model 'AudioFileUploadedEvent'
        db.create_table('event_audiofileuploadedevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['AudioFileUploadedEvent'])

        # Adding model 'JoinCollectionEvent'
        db.create_table('event_joincollectionevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['JoinCollectionEvent'])

        # Adding model 'LeaveCollectionEvent'
        db.create_table('event_leavecollectionevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['LeaveCollectionEvent'])

        # Adding model 'CreateCollectionEvent'
        db.create_table('event_createcollectionevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['CreateCollectionEvent'])

        # Adding model 'RequestJoinCollectionEvent'
        db.create_table('event_requestjoincollectionevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['RequestJoinCollectionEvent'])

        # Adding model 'RequestDeniedEvent'
        db.create_table('event_requestdeniedevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['RequestDeniedEvent'])

        # Adding model 'RequestRevokedEvent'
        db.create_table('event_requestrevokedevent', (
            ('event_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['event.Event'], unique=True, primary_key=True)),
        ))
        db.send_create_signal('event', ['RequestRevokedEvent'])


    def backwards(self, orm):
        
        # Deleting model 'Event'
        db.delete_table('event_event')

        # Deleting model 'TagCommentEvent'
        db.delete_table('event_tagcommentevent')

        # Deleting model 'AudioSegmentCommentEvent'
        db.delete_table('event_audiosegmentcommentevent')

        # Deleting model 'AudioFileCommentEvent'
        db.delete_table('event_audiofilecommentevent')

        # Deleting model 'AudioSegmentCreatedEvent'
        db.delete_table('event_audiosegmentcreatedevent')

        # Deleting model 'AudioSegmentTaggedEvent'
        db.delete_table('event_audiosegmenttaggedevent')

        # Deleting model 'AudioFileUploadedEvent'
        db.delete_table('event_audiofileuploadedevent')

        # Deleting model 'JoinCollectionEvent'
        db.delete_table('event_joincollectionevent')

        # Deleting model 'LeaveCollectionEvent'
        db.delete_table('event_leavecollectionevent')

        # Deleting model 'CreateCollectionEvent'
        db.delete_table('event_createcollectionevent')

        # Deleting model 'RequestJoinCollectionEvent'
        db.delete_table('event_requestjoincollectionevent')

        # Deleting model 'RequestDeniedEvent'
        db.delete_table('event_requestdeniedevent')

        # Deleting model 'RequestRevokedEvent'
        db.delete_table('event_requestrevokedevent')


    models = {
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
            'comment': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'eventType': ('django.db.models.fields.IntegerField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'time': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'events'", 'to': "orm['auth.User']"})
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
        'event.tagcommentevent': {
            'Meta': {'object_name': 'TagCommentEvent', '_ormbases': ['event.Event']},
            'event_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['event.Event']", 'unique': 'True', 'primary_key': 'True'})
        }
    }

    complete_apps = ['event']
