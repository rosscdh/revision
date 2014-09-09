# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from .views import (ProjectListView,
                    ProjectDetailView,
                    ProjectChronicleView)
from .views import (VideoSubtitleView,)


urlpatterns = patterns('',
    url(r'^(?P<slug>[\w-]+)/(?P<version_slug>[\d\w-]+)/$', ProjectDetailView.as_view(), name='with_video_detail'),    
    url(r'^(?P<slug>[\w-]+)/(?P<version_slug>[\d\w-]+)/subtitles/$', VideoSubtitleView.as_view(), name='video_subtitles_url'),
    url(r'^(?P<slug>[\w-]+)/chronicle/$', ProjectChronicleView.as_view(), name='chronicle'),
    url(r'^(?P<slug>[\w-]+)/$', ProjectDetailView.as_view(), name='detail'),
    url(r'^$', ProjectListView.as_view(), name='list'),
)
