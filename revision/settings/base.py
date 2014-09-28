# coding: utf-8
import os

import dj_email_url
import dj_database_url
import django_cache_url
from unipath import FSPath as Path
from django.core.exceptions import ImproperlyConfigured


# Helper for env vars
def env(var, default=None):
    try:
        val = os.environ[var]
        if val.lower() == 'true':
            val = True
        elif val.lower() == 'false':
            val = False
        return val
    except KeyError:
        if default is not None:
            return default
        raise ImproperlyConfigured('Set the %s environment variable' % var)

# Paths
PROJECT_DIR = Path(__file__).absolute().ancestor(2)

# Debugging
DEBUG = False
TEMPLATE_DEBUG = DEBUG

# Security
SECRET_KEY = env('SECRET_KEY')
ALLOWED_HOSTS = []

URL_ENCODE_SECRET_KEY = env('URL_ENCODE_SECRET_KEY')

# Site
SITE_ID = 1
SITE_DOMAIN = 'revisi.on'
SITE_NAME = 'Revision'

# Middleware
MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'pipeline.middleware.MinifyHTMLMiddleware',
)

# Context
TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.core.context_processors.request",
    "django.contrib.messages.context_processors.messages"
    # "revision.apps.subscribe.context_processors.EXPOSED_GLOBALS",
)

# Urls
ROOT_URLCONF = 'revision.urls'

# WSGI
WSGI_APPLICATION = 'revision.wsgi.application'

# Application definition
DJANGO_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.humanize',
)

THIRD_PARTY_APPS = (
    'braces',
    'parsley',
    # 'payments',
    'storages',
    'pipeline',
    'crispy_forms',
    'password_reset',
    'rest_framework',
    'templated_email',
    'django_extensions',
)

LOCAL_APPS = (
    'revision.api',  # Api interface
    'revision.apps.me',  # user profiles
    'revision.apps.client',  # clients
    'revision.apps.project',  # projects
    'revision.apps.public',  # public views
    # 'revision.apps.revision',
    # 'revision.apps.comment',
    # 'revision.apps.comment',
)

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Default File Storage
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'

# Authentication
AUTHENTICATION_BACKENDS = (
    'revision.auth_backends.EmailBackend',
    # 'revision.auth_backends.SimpleUserLoginBackend',
    'django.contrib.auth.backends.ModelBackend',
)

LOGIN_URL = '/start/'
LOGIN_REDIRECT_URL = '/p/'
LOGIN_ERROR_URL = '/login-error/'
LOGOUT_URL = '/end/'

# Database
DATABASES = {
    'default': dj_database_url.config('DATABASE_URL')
}

# Cache
# CACHES = {
#     'default': django_cache_url.config()
# }

# Sessions
# SESSION_ENGINE = "django.contrib.sessions.backends.cache"
# SESSION_CACHE_ALIAS = "default"

# Email
DEFAULT_FROM_EMAIL = env('FROM_EMAIL')

email_config = dj_email_url.config()
EMAIL_FILE_PATH = email_config['EMAIL_FILE_PATH']
EMAIL_HOST_USER = email_config['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = email_config['EMAIL_HOST_PASSWORD']
EMAIL_HOST = email_config['EMAIL_HOST']
EMAIL_PORT = email_config['EMAIL_PORT']
EMAIL_BACKEND = email_config['EMAIL_BACKEND']
EMAIL_USE_TLS = email_config['EMAIL_USE_TLS']

TEMPLATED_EMAIL_BACKEND = 'templated_email.backends.vanilla_django'

# Dates and times
USE_TZ = True
TIME_ZONE = 'UTC'

# Internationalization
LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True

# Media files (Uploads)
MEDIA_URL = env('MEDIA_URL', '/media/')
MEDIA_ROOT = env('MEDIA_ROOT', PROJECT_DIR.ancestor(1).child('media'))

# Static files (CSS, JavaScript, Images)
STATIC_URL = env('STATIC_URL', '/static/')
STATIC_ROOT = env('STATIC_ROOT', PROJECT_DIR.ancestor(1).child('static'))

STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'pipeline.finders.FileSystemFinder',
    # 'pipeline.finders.AppDirectoriesFinder',
    # 'pipeline.finders.PipelineFinder',
    # 'pipeline.finders.CachedFileFinder',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.contrib.messages.context_processors.messages',
    'django.core.context_processors.request',
    'revision.context_processors.GLOBALS',
)

PIPELINE_CSS = {
    # 'uploader': {
    #     'source_filenames': (
    #         'js/uploader/css/jquery.fileupload.css',
    #     ),
    #     'output_filename': 'js/dist/uploader.css',
    #     'extra_context': {
    #         'media': 'screen,projection',
    #     },
    # }
}

PIPELINE_JS = {
    'react': {
        'source_filenames': (
            'js/reactjs/0.11.1/react-with-addons.js',
            'js/common.jsx',
            'js/messages.jsx',
            'js/videoplayer.jsx',
        ),
        'output_filename': 'js/dist/react.js'
    },
    'resources': {
        'source_filenames': (
            'js/resources/resource.js',  # api
            # resources api
            'js/resources/user_resource.js',
            'js/resources/project_resource.js',
            'js/resources/collaborator_resource.js',
            'js/resources/video_resource.js',
            'js/resources/comment_resource.js',
        ),
        'output_filename': 'js/dist/resources.js'
    },
    'project_list': {
        'source_filenames': (
            'js/resources/project_resource.js',
            'js/project_list.jsx',
        ),
        'output_filename': 'js/project_list.js',
    },
    'project': {
        'source_filenames': (
            # react components
            'js/project_collaborators.jsx',
            'js/project_comments.jsx',
            'js/project_video.jsx',
            'js/project_detail.jsx',
        ),
        'output_filename': 'js/dist/project.js',
    },
    'project_chronicle': {
        'source_filenames': (
            'js/project_collaborators.jsx',
            'js/project_comments.jsx',
            'js/project_chronicle.jsx',
        ),
        'output_filename': 'js/dist/chronicle.js',
    },
    'uploader': {
        'source_filenames': (
            'uploader/js/evaporate-0.0.2.js',
            'js/videouploader.jsx',
        ),
        'output_filename': 'js/dist/uploader.js',
    }
}

PIPELINE_COMPILERS = [
    'pipeline.compilers.less.LessCompiler',
    'react.utils.pipeline.JSXCompiler',
]

# Crispy forms
CRISPY_TEMPLATE_PACK = 'bootstrap3'

# Templates
TEMPLATE_DIRS = (
    PROJECT_DIR.ancestor(1).child('templates'),
)

# Raven
if 'RAVEN_DSN' in os.environ:
    INSTALLED_APPS += ('raven.contrib.django.raven_compat',)
    RAVEN_CONFIG = {
        'dsn': env('RAVEN_DSN'),
    }

# Payments
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "sk_test_4TQt1KQ0HqJzsm4k6I98ppVQ")
STRIPE_PUBLIC_KEY = os.environ.get("STRIPE_PUBLIC_KEY", "pk_test_4TQtMXsWeYaQHIsSoII3rrMc")
PAYMENTS_INVOICE_FROM_EMAIL = 'founders@revision.com'
PAYMENTS_PLANS = {
    "subscribe": {
        "stripe_plan_id": "subscribe",
        "name": "Subscription",
        "description": "Get a monthly delivery of 30 Nootroo (15 silver and 15 gold).",
        "features": "Get access to our exclusive members are a bunch of other really cool stuff.",
        "price": 79.99,
        "currency": "usd",
        "interval": "month"
    }
}

# Intercom
INTERCOM_APP_ID = None

# Mixpanel
MIXPANEL_SETTINGS = {}

# Rest framework
REST_FRAMEWORK = {
    # Use hyperlinked styles by default.
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.UnicodeJSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # 'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        # 'rest_framework.authentication.BasicAuthentication', # Here Temporarily for dev
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # only use this in dev
        # 'toolkit.apps.api.permissions.ApiObjectPermission',
    ],
    'DEFAULT_FILTER_BACKENDS': (
        'rest_framework.filters.DjangoFilterBackend',
    ),
    'PAGINATE_BY': 100,
}

# Queue
# BROKER_URL = env('BROKER_URL')
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_ACCEPT_CONTENT = ['application/json']

# CELERY_IGNORE_RESULT = False
# CELERY_RESULT_BACKEND = 'djcelery.backends.database:DatabaseBackend'
# CELERY_TASK_RESULT_EXPIRES = 60 * 60 * 24 * 30

# CELERYBEAT_SCHEDULER = 'djcelery.schedulers.DatabaseScheduler'

# CELERYD_HIJACK_ROOT_LOGGER = False
# CELERYD_LOG_COLOR = False
# CELERY_REDIRECT_STDOUTS = True
# CELERY_REDIRECT_STDOUTS_LEVEL = 'INFO'

# AWS
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME", 'dev-revision')

AWS_ACCESS_KEY_ID = 'AKIAILCDLSICVXLIOPKA'
AWS_SECRET_ACCESS_KEY = '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'
AWS_STORAGE_BUCKET_NAME = 'dev-revision'

AWS_HEADERS = {
    'Cache-Control': 'max-age=86400',
    'x-amz-acl': 'public-read',
}

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
    },
    'formatters': {
        'verbose': {
            # '()': '{{ cookiecutter.repo_name }}.utils.log.MicrosecondFormatter',
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s',
        },
        # 'celery': {
        #     '()': '{{ cookiecutter.repo_name }}.utils.log.MicrosecondFormatter',
        #     'format': '%(asctime)s [%(levelname)s/%(processName)s] %(name)s: %(message)s',
        # },
        # 'task': {
        #     '()': '{{ cookiecutter.repo_name }}.utils.log.TaskFormatter',
        #     'format': '%(asctime)s [%(levelname)s/%(processName)s] %(task_name)s[%(task_id)s]: %(message)s',
        # },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        # 'celery': {
        #     'level': 'INFO',
        #     'class': 'logging.StreamHandler',
        #     'formatter': 'celery',
        # },
        # 'task': {
        #     'level': 'INFO',
        #     'class': 'logging.StreamHandler',
        #     'formatter': 'task',
        # },
        'sentry': {
            'level': 'WARNING',
            'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
            'filters': ['require_debug_false'],
        },
        'null': {
            'class': 'logging.NullHandler',
        },
    },
    'loggers': {
        '': {
            'level': 'INFO',
            'handlers': ['console', 'sentry'],
        },

        # Celery logging
        # 'djcelery': {
        #     'handlers': ['celery', 'sentry'],
        #     'propagate': False,
        # },
        # 'celery': {
        #     'handlers': ['celery', 'sentry'],
        #     'propagate': False,
        # },
        # 'celery.task': {
        #     'handlers': ['task', 'sentry'],
        #     'propagate': False,
        # },

        # Django default logging
        'django.request': {
            'propagate': True,
        },
        'django.security': {
            'propagate': True,
        },

        # Example of overwriting annoying loggers:
        # 'urllib3.connectionpool': {
        #     'level': 'WARNING',
        # },
        # or:
        # 'urllib3.connectionpool': {
        #     'handlers': ['null'],
        # },
    }
}
