# -*- coding: utf-8 -*-
from django.conf.urls import patterns, url
from django.contrib.auth.decorators import login_required

from .views import (ProjectListView,
                    ProjectCreateView,
                    ProjectDetailView,
                    ProjectChronicleView)
from .views import (VideoSubtitleView,)


urlpatterns = patterns('',
    url(r'^(?P<slug>[\w-]+)/chronicle/$', login_required(ProjectChronicleView.as_view()), name='chronicle'),
    url(r'^(?P<slug>[\w-]+)/(?P<version_slug>[\d\w-]+)/$', login_required(ProjectDetailView.as_view()), name='with_video_detail'),
    url(r'^(?P<slug>[\w-]+)/(?P<version_slug>[\d\w-]+)/subtitles/$', login_required(VideoSubtitleView.as_view()), name='video_subtitles_url'),

    url(r'^create/$', login_required(ProjectCreateView.as_view()), name='create'),
    url(r'^(?P<slug>[\w-]+)/$', login_required(ProjectDetailView.as_view()), name='detail'),

    url(r'^$', login_required(ProjectListView.as_view()), name='list'),
)
