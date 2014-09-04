# -*- coding: utf-8 -*-
from rest_framework import viewsets

from ..models import Project, Video
from .serializers import ProjectSerializer, VideoSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'


class VideoViewSet(viewsets.ModelViewSet):
    """
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    lookup_field = 'slug'