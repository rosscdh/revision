# -*- coding: utf-8 -*-
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


PROJECT_ENVIRONMENT = 'prod'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '$oddz)vsw11*@#7nm#j*(noi3%_ot-(%hf1#md)(0(o25*bb0h'

# used for order confirmation token
URL_ENCODE_SECRET_KEY = 'd+gi#5kfd^$4kdep*2tem+u+=yqmpblbjup78*w_@o3tg!)0qb'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = ['*']

SITE_ID = 1

ADMINS = (
    ("Ross Crawford-dHeureuse", 'sendrossemail@gmail.com'),
)

MANAGERS = ADMINS + ()

DEFAULT_FROM = (
 ("Revision Support", 'support@revisi.on'),
)

AUTHENTICATION_BACKENDS = (
    'revision.auth_backends.EmailBackend',
    'revision.auth_backends.SimpleUserLoginBackend',
    'django.contrib.auth.backends.ModelBackend',
)

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

PROJECT_APPS = (
    'revision.api',  # Api interface
    'revision.apps.me',  # user profiles
    'revision.apps.project',  # projects
    'revision.apps.public',  # public views
    #'revision.apps.revision',
    #'revision.apps.comment',
    #'revision.apps.comment',
)

HELPER_APPS = (
    'braces',
    'parsley',
    #'payments',
    'pipeline',
    'crispy_forms',
    'rest_framework',
    'templated_email',
    'django_extensions',
)

INSTALLED_APPS = DJANGO_APPS + PROJECT_APPS + HELPER_APPS

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'pipeline.middleware.MinifyHTMLMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.static",
    "django.core.context_processors.tz",
    "django.contrib.messages.context_processors.messages",
    #"revision.apps.subscribe.context_processors.EXPOSED_GLOBALS",
)

ROOT_URLCONF = 'revision.urls'

WSGI_APPLICATION = 'revision.wsgi.application'

LOGIN_URL          = '/start/'
LOGIN_REDIRECT_URL = '/'
LOGIN_ERROR_URL    = '/'
LOGOUT_URL = '/end/'

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'dev.db'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

INTERNAL_IPS = ('127.0.0.1',)

# List of callables that know how to import templates from various sources.
TEMPLATE_DIRS = (
    os.path.join(BASE_DIR, 'templates'),
)


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'


MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/m/'


#
# Crispy
#
CRISPY_TEMPLATE_PACK = 'bootstrap3'

# EMAIL
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
TEMPLATED_EMAIL_BACKEND = 'templated_email.backends.vanilla_django'

#
# Pipeline
#
STATICFILES_STORAGE = 'pipeline.storage.PipelineCachedStorage'
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'pipeline.finders.FileSystemFinder',
    # 'pipeline.finders.AppDirectoriesFinder',
    # 'pipeline.finders.PipelineFinder',
    # 'pipeline.finders.CachedFileFinder',
)
# PIPELINE_CSS = {
#   'core': {
#         'source_filenames': (
#             'css/bootstrap.css',
#             'fonts/pe-7s/css/pe-icon-7-stroke.css',
#         ),
#         'output_filename': 'css/application.css',
#         'extra_context': {
#             'media': 'screen,projection',
#         },
#   }
# }
PIPELINE_JS = {
    'react': {
        'source_filenames': (
            'js/reactjs/0.11.1/react-with-addons.js',
            'js/common.jsx',
            'js/videoplayer.jsx',
        ),
        'output_filename': 'js/react.js'
    },
    'resources': {
        'source_filenames': (
            'js/resource.js',  # api
            # resources api
            'js/project_resource.js',
            'js/project_comments.js',
        ),
        'output_filename': 'js/react.js'
    },
    'project': {
        'source_filenames': (
            # react components
            'js/project_collaborators.jsx',
            'js/project_comments.jsx',
            'js/project_detail.jsx',
        ),
        'output_filename': 'js/project.js',
    },
    'project_chronicle': {
        'source_filenames': (
            'js/project_collaborators.jsx',
            'js/project_comments.jsx',
            'js/project_chronicle.jsx',
        ),
        'output_filename': 'js/chronicle.js',
    }
}
PIPELINE_COMPILERS = [
    'pipeline.compilers.less.LessCompiler',
    'react.utils.pipeline.JSXCompiler',
]

#
# Payments
#
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

#
# Intercom
#
INTERCOM_APP_ID = None
#
# Mixpanel
#
MIXPANEL_SETTINGS = {}

REST_FRAMEWORK = {
    # Use hyperlinked styles by default.
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.UnicodeJSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        #'rest_framework.authentication.TokenAuthentication',
        #'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        #'rest_framework.authentication.BasicAuthentication', # Here Temporarily for dev
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # only use this in dev
        #'toolkit.apps.api.permissions.ApiObjectPermission',
    ],
    'PAGINATE_BY': 100,
}

try:
    LOCAL_SETTINGS
except NameError:
    try:
        from local_settings import *
    except ImportError:
        print("Could not load local_settings")
