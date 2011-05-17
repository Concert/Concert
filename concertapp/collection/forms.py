from concertapp.models import AudioFile, Collection
from django import forms
from django.forms import ModelForm

##
#   A form used to validate the name of a new collection
##
class CreateCollectionForm(ModelForm):
    # This form is bound to a collection object
    class Meta:
        model = Collection
        # We don't need to validate the Collection admin, or the user list
        exclude = ('admin', 'users', 'requesting_users')
