# -*- coding: utf-8 -*-
from django.views.generic import DetailView

from rest_framework.renderers import JSONRenderer

from .api.serializers import ProjectSerializer, VideoSerializer
from .models import Project


class ProjectDetailView(DetailView):
    model = Project

    @property
    def project_json(self):
        return JSONRenderer().render(ProjectSerializer(self.object).data)

    @property
    def video_json(self):
        return JSONRenderer().render(VideoSerializer(self.current_video).data)

    @property
    def current_video(self):
        version_slug = self.kwargs.get('version_slug', None)
        self._current_video = self.object.video_set.get(slug=version_slug) if version_slug is not None else self.object.video_set.all().first()
        return self._current_video