import os, sys
from django.conf import global_settings


DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    #('Admin', 'concertsoundorganizer@concertsoundorganizer.org'),
)

MANAGERS = ADMINS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': '/opt/concert/db/database.db',
#        'NAME': '/Users/sarojini/Projects/databases/Concert/concert.db',
        'HOST': '',
        'PORT': '',
        'USER': '',
        'PASSWORD': ''
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Los_Angeles'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = False

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
#    'django.contrib.sites',
    'django.contrib.admin',
    'django.contrib.markup',
    'tastypie',
    'south',
    'djcelery',
    'concertapp',
    'concertapp.baseaudio',
    'concertapp.audiofile',
    'concertapp.audiosegment',
    'concertapp.collection',
    'concertapp.event',
    'concertapp.tag',
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

# Ensures that uploaded files will never be kept in memory, and will always be written to disk.
FILE_UPLOAD_HANDLERS = (
    "django.core.files.uploadhandler.TemporaryFileUploadHandler",
)

# Files that are being processed
TO_PROCESS_DIRECTORY = '/opt/concert/tmp/to_process'

# Cache!
CACHE_BACKEND = 'memcached://127.0.0.1:11211/'

AUTH_PROFILE_MODULE = 'concertapp.ConcertUser'

DEFAULT_FROM_EMAIL = 'apg552@gmail.com'

SITE_ID = 1

CSRF_FAILURE_VIEW='concertapp.lib.errorviews.csrf_failure'

TASTYPIE_DATETIME_FORMATTING='rfc-2822'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True
        },
        'concertapp': {
            'handlers': ['console'],
            'level': 'INFO',
            'propogate': True,
        }
    }
}

import djcelery
djcelery.setup_loader()

# List of modules to import when celery starts.
CELERY_IMPORTS = ()

## Result store settings.
CELERY_RESULT_BACKEND = "database"
CELERY_RESULT_DBURI = "sqlite:///opt/concert/db/database.db"
# echo enables verbose logging from SQLAlchemy.
CELERY_RESULT_ENGINE_OPTIONS = {"echo": True}

## Broker settings.
BROKER_HOST = "localhost"
BROKER_PORT = 5672
BROKER_VHOST = "concertmqhost"
BROKER_USER = "concertmquser"
BROKER_PASSWORD = "concert6^6"

## Worker settings
## If you're doing mostly I/O you can have more processes,
## but if mostly spending CPU, try to keep it close to the
## number of CPUs on your machine. If not set, the number of CPUs/cores
## available will be used.
CELERYD_CONCURRENCY = 2
#CELERYD_LOG_FILE="/var/log/celery/%n.log"
#CELERYD_PID_FILE="/var/run/celery/%n.pid"
#CELERY_LOG_LEVEL="INFO"

# Amazon credentials (for uploading audio)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
S3_BUCKET=""
