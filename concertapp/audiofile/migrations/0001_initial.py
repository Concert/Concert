# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'AudioFile'
        db.create_table('audiofile_audiofile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('wav', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
            ('ogg', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
            ('mp3', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
            ('duration', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=8, decimal_places=2)),
            ('status', self.gf('django.db.models.fields.CharField')(default='u', max_length=1)),
            ('progress', self.gf('django.db.models.fields.DecimalField')(default=0, max_digits=3, decimal_places=2)),
        ))
        db.send_create_signal('audiofile', ['AudioFile'])


    def backwards(self, orm):
        
        # Deleting model 'AudioFile'
        db.delete_table('audiofile_audiofile')


    models = {
        'audiofile.audiofile': {
            'Meta': {'object_name': 'AudioFile'},
            'duration': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '8', 'decimal_places': '2'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mp3': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'ogg': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'progress': ('django.db.models.fields.DecimalField', [], {'default': '0', 'max_digits': '3', 'decimal_places': '2'}),
            'status': ('django.db.models.fields.CharField', [], {'default': "'u'", 'max_length': '1'}),
            'wav': ('django.db.models.fields.files.FileField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['audiofile']
