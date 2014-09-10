# -*- coding: UTF-8 -*-
from django.conf.urls import patterns, url

from rest_framework import routers

from revision.apps.project.api.views import (ProjectViewSet,
                                            VideoViewSet,)
from revision.apps.project.api.views import (VideoCommentsEndpoint,
                                            VideoCommentDetailEndpoint,)
from revision.apps.me.api.views import (UserProfileViewSet,
                                        CollaboratorEndpoint,)

router = routers.SimpleRouter(trailing_slash=True)

"""
ViewSets
"""
router.register(r'users', UserProfileViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'videos', VideoViewSet)


urlpatterns = patterns('',

    url(r'^projects/(?P<slug>[\d\w-]+)/collaborators/((?P<email>.*)/)?$', CollaboratorEndpoint.as_view(), name='project_collaborators'),

    url(r'^videos/(?P<slug>[\d\w-]+)/comments/$', VideoCommentsEndpoint.as_view(), name='video_comments'),
    url(r'^videos/(?P<slug>[\d\w-]+)/comments/(?P<pk>[\d]+)/$', VideoCommentDetailEndpoint.as_view(), name='video_comment_detail'),
) + router.urls
