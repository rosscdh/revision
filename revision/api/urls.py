# -*- coding: UTF-8 -*-
from django.conf.urls import patterns, url

from rest_framework import routers

from revision.apps.project.api.views import (ProjectViewSet,
                                            VideoViewSet,)
from revision.apps.project.api.views import (VideoCommentsEndpoint,
                                            VideoCommentDetailEndpoint,)

router = routers.SimpleRouter(trailing_slash=True)

"""
ViewSets
"""
router.register(r'projects', ProjectViewSet)
router.register(r'videos', VideoViewSet)


urlpatterns = patterns('',
    url(r'^videos/(?P<slug>[\d\w-]+)/comments/$', VideoCommentsEndpoint.as_view(), name='video_comments'),
    url(r'^videos/(?P<slug>[\d\w-]+)/comment/(?P<pk>[\d\w-]+)/$', VideoCommentDetailEndpoint.as_view(), name='video_comment_detail'),
) + router.urls
