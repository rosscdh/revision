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
INSTALLED_APPS += (
    #'debug_toolbar',
    # User switcher
    #'debug_toolbar_user_panel',
)

# MIDDLEWARE_CLASSES += ('debug_toolbar.middleware.DebugToolbarMiddleware',)

# INTERNAL_IPS = ('127.0.0.1',)

# DEBUG_TOOLBAR_PANELS = [
#     'debug_toolbar.panels.versions.VersionsPanel',
#     'debug_toolbar.panels.timer.TimerPanel',
#     'debug_toolbar.panels.settings.SettingsPanel',
#     'debug_toolbar.panels.headers.HeadersPanel',
#     'debug_toolbar.panels.request.RequestPanel',
#     'debug_toolbar.panels.sql.SQLPanel',
#     'debug_toolbar.panels.staticfiles.StaticFilesPanel',
#     'debug_toolbar.panels.templates.TemplatesPanel',
#     'debug_toolbar.panels.cache.CachePanel',
#     'debug_toolbar.panels.signals.SignalsPanel',
#     'debug_toolbar.panels.logging.LoggingPanel',
#     'debug_toolbar.panels.redirects.RedirectsPanel',
#     'debug_toolbar_user_panel.panels.UserPanel',
# ]
