import os, sys
from django.conf import global_settings


DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)

MANAGERS = ADMINS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# TODO: Is this necessary anymore?
# Fix up piston imports here. We would normally place piston in 
# a directory accessible via the Django app, but this is an
# example and we ship it a couple of directories up.
sys.path.insert(0, os.path.join(BASE_DIR, '..', '..'))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'concert',                      # Or path to database file if using sqlite3.
        'USER': 'concert',                      # Not used with sqlite3.
        'PASSWORD': 'concert',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}


# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/New_York'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# Absolute path to the directory that holds media.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/media/'

# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/media/admin/'
STATIC_DOC_ROOT = os.path.join(BASE_DIR, 'static')


# Make this unique, and don't share it with anybody.
SECRET_KEY = 'f@vhy8vuq7w70v=cnynm(am1__*zt##i2--i2p-021@-qgws%g'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.load_template_source',
    'django.template.loaders.app_directories.load_template_source',

#     'django.template.loaders.eggs.load_template_source',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.csrf.CsrfResponseMiddleware',
    
    'concertapp.lib.ConcertMiddleware.ConcertBootstrapDataMiddleware',
    
    
    # Keep this one at the bottom so we can feel secure about things
    'concertapp.lib.ConcertMiddleware.ConcertCSRFMiddleware',
)


DEBUG_PROPAGATE_EXCEPTIONS = True

ROOT_URLCONF = 'concertapp.urls'

TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'templates'),
    )

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.admin',
    'django.contrib.markup',
    'tastypie',
    'concertapp',
)

FIXTURE_DIRS = (
    os.path.join(BASE_DIR, 'fixtures'),
)

# registration
LOGIN_REDIRECT_URL = "/"
LOGIN_URL = '/login/'
LOGOUT_URL = '/logout/'

APPEND_SLASH = True

# Make all uploaded files write to disk
FILE_UPLOAD_MAX_MEMORY_SIZE = 0

# New file upload handlers for progress uploads
FILE_UPLOAD_HANDLERS = (
    'concertapp.uploadprogresscachedhandler.UploadProgressCachedHandler', 
) + global_settings.FILE_UPLOAD_HANDLERS

# Cache!
CACHE_BACKEND = 'memcached://127.0.0.1:11211/'

AUTH_PROFILE_MODULE = 'concertapp.ConcertUser'

DEFAULT_FROM_EMAIL = 'apg552@gmail.com'

SITE_ID = 1

CSRF_FAILURE_VIEW='concertapp.lib.errorviews.csrf_failure'

TASTYPIE_DATETIME_FORMATTING='rfc-2822'
