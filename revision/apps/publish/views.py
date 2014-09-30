# -*- coding: utf-8 -*-
from django.contrib import messages
from django.core.urlresolvers import reverse
from django.views.generic import (DetailView, UpdateView,)
from django.shortcuts import get_object_or_404

from rest_framework.renderers import JSONRenderer

from revision.apps.project.models import Video
from revision.apps.project.api.serializers import (VideoSerializer,)

from .models import Published
from .forms import VideoSettingsForm


class PublishedVideoSettingsView(UpdateView):
    model = Published
    form_class = VideoSettingsForm
    template_name = 'publish/video_settings.html'

    @property
    def video(self):
        return get_object_or_404(Video, slug=self.kwargs.get('slug'))

    def get_success_url(self):
        messages.success(self.request, 'Success, Updated Publish Setings')
        return reverse('publish:settings', kwargs={'slug': self.kwargs.get('slug')})

    def get_object(self, queryset=None):
        obj, is_new = self.model.objects.get_or_create(video=self.video)
        return obj


class PublishedVideoView(DetailView):
    model = Published

    @property
    def video_json(self):
        return JSONRenderer().render(VideoSerializer(self.object.video).data)
    def get_template_names(self, **kwargs):
        if self.object.is_published is False:
            return ('publish/not_published.html',)

        return super(PublishedVideoView, self).get_template_names(**kwargs)