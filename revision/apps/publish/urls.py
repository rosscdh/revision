# -*- coding: UTF-8 -*-
from django.conf.urls import patterns, url
from django.contrib.auth.decorators import login_required

from .views import (PublishedVideoSettingsView,
                    PublishedVideoView,)


urlpatterns = patterns(
    '',
    url(r'^(?P<slug>[\d\w-]+)/settings/$', login_required(PublishedVideoSettingsView.as_view()), name='settings'),
    url(r'^view/(?P<slug>[\d\w-]+)/$', login_required(PublishedVideoView.as_view()), name='view'),
)
