# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from .views import ProjectDetailView, VideoSubtitleView


urlpatterns = patterns('',
    url(r'^mock/$', TemplateView.as_view(template_name='project/mock.html'), name='mock'),
    url(r'^(?P<slug>[\w-]+)/((?P<version_slug>[\d\w-]+)/)?$', ProjectDetailView.as_view(), name='detail'),
    url(r'^(?P<slug>[\w-]+)/(?P<version_slug>[\d\w-]+)/$', ProjectDetailView.as_view(), name='with_video_detail'),
    url(r'^(?P<slug>[\w-]+)/(?P<version_slug>[\d\w-]+)/subtitles/$', VideoSubtitleView.as_view(), name='video_subtitles_url'),
    
)
