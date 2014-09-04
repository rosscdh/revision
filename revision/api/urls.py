# -*- coding: UTF-8 -*-
from django.conf.urls import patterns

from rest_framework import routers

from revision.apps.project.api.views import ProjectViewSet, VideoViewSet


router = routers.SimpleRouter(trailing_slash=False)

"""
ViewSets
"""
router.register(r'projects', ProjectViewSet)
router.register(r'videos', VideoViewSet)


urlpatterns = router.urls + patterns('',)
