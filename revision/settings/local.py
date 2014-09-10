# coding: utf-8
from .base import *  # noqa

# Debug
DEBUG = True
TEMPLATE_DEBUG = DEBUG

# Allow everything, so we can set something memorable in our hosts file if we want
ALLOWED_HOSTS = ['*']

# Multiple projects running on localhost messes with sessions:
SESSION_COOKIE_NAME = "revision-sessionid"

# Debug Toolbar
INSTALLED_APPS += ('debug_toolbar',)
MIDDLEWARE_CLASSES += ('debug_toolbar.middleware.DebugToolbarMiddleware',)

INTERNAL_IPS = ('127.0.0.1',)

# Dummy data
INSTALLED_APPS += ('revision.apps.dummy',)
