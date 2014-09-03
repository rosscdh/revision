# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView


urlpatterns = patterns('',
    url(r'^p/mock/$', TemplateView.as_view(template_name='project/mock.html'), name='mock'),
    url(r'^p/my-cool-project/$', TemplateView.as_view(template_name='project/project_detail.html'), name='project_detail'),
)
