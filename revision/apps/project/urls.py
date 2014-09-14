# -*- coding: utf-8 -*-
from django.conf.urls import patterns, url

from .views import (ProjectListView,
                    ProjectDetailView,
                    ProjectChronicleView,
                    ProjectXmlView)
from .views import (VideoSubtitleView,)


urlpatterns = patterns('',
    url(r'^(?P<slug>[\w-]+)/chronicle/$', ProjectChronicleView.as_view(), name='chronicle'),

    url(r'^(?P<slug>[\w-]+)/(?P<version_slug>[\d\w-]+)/subtitles/$', VideoSubtitleView.as_view(), name='video_subtitles_url'),
    url(r'^(?P<slug>[\w-]+)/(?P<version_slug>[\d\w-]+)/xml$', ProjectXmlView.as_view(), name='xml'),
    url(r'^(?P<slug>[\w-]+)/(?P<version_slug>[\d\w-]+)/$', ProjectDetailView.as_view(), name='with_video_detail'),
    url(r'^(?P<slug>[\w-]+)/$', ProjectDetailView.as_view(), name='detail'),
    url(r'^$', ProjectListView.as_view(), name='list'),
)
