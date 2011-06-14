from django.conf import settings
from django.contrib.auth import REDIRECT_FIELD_NAME
# Avoid shadowing the login() view below.
from django.contrib.auth import login as auth_login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from concertapp.users.forms import UserRegisterForm
from django.contrib.auth.models import User
from django.contrib.sites.models import Site, RequestSite
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.template import RequestContext
from django.utils.translation import ugettext as _
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
import re

@csrf_protect
@never_cache
def login_register(request, redirect_field_name=REDIRECT_FIELD_NAME):
    """Displays the login form and handles the login action."""

    redirect_to = request.REQUEST.get(redirect_field_name, '')
    
    if request.method == "POST":
        # Since this view is handeling two forms in similar ways check if either are valid
        login_form = AuthenticationForm(data=request.POST)
        login_valid = False
        if login_form.is_valid():
            login_valid = True
        
        register_form = UserRegisterForm(data=request.POST)
        register_valid = False
        if register_form.is_valid():
            register_valid = True
        
        if login_valid or register_valid:
            # Light security check -- make sure redirect_to isn't garbage.
            if not redirect_to or ' ' in redirect_to:
                redirect_to = settings.LOGIN_REDIRECT_URL
                
            # Heavier security check -- redirects to http://example.com should 
            # not be allowed, but things like /view/?param=http://example.com 
            # should be allowed. This regex checks if there is a '//' *before* a
            # question mark.
            elif '//' in redirect_to and re.match(r'[^\?]*//', redirect_to):
                redirect_to = settings.LOGIN_REDIRECT_URL
                                
            # If they're just logining, get the user
            if login_valid:
                user = login_form.get_user()

            # If they just registered, save the user, and authenticate them
            elif register_valid:
                register_form.save()
                password = register_form.cleaned_data['password1']
                username = register_form.cleaned_data['username']
                user = authenticate(username=username,password=password)

            # Using user found in one of the above two conditionals, login 
            auth_login(request,user)

            if request.session.test_cookie_worked():
                request.session.delete_test_cookie()
                
            return HttpResponseRedirect(redirect_to)            

    else:
        login_form = AuthenticationForm(request)
        register_form = UserRegisterForm()
    
    request.session.set_test_cookie()
    
#    if Site._meta.installed:
#        current_site = Site.objects.get_current()
#    else:
#        current_site = RequestSite(request)
    
    return TemplateResponse(request, 'users/login_register.html', {
            'login_form': login_form,
            'register_form': register_form,
            redirect_field_name: redirect_to,
#            'site': current_site,
#            'site_name': current_site.name,
            })
