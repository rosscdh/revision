# -*- coding: utf-8 -*-
from django.views.generic import (DetailView,)
from django.views.generic.edit import FormMixin
from django.shortcuts import get_object_or_404

from revision.apps.project.models import Video

from .models import Published
from .forms import VideoSettingsForm


class PublishedVideoSettingsView(FormMixin, DetailView):
    model = Published
    form_class = VideoSettingsForm
    template_name = 'publish/video_settings.html'

    @property
    def video(self):
        return get_object_or_404(Video, slug=self.kwargs.get('slug'))

    def get_object(self, queryset=None):
        obj, is_new = self.model.objects.get_or_create(video=self.video)
        return obj

    def get_form_kwargs(self):
        kwargs = super(PublishedVideoSettingsView, self).get_form_kwargs()
        kwargs.update({
            'publish': self.object,
        })
        return kwargs

    def get_context_data(self, **kwargs):
        kwargs = super(PublishedVideoSettingsView, self).get_context_data(**kwargs)
        kwargs.update({
            'form': self.get_form(form_class=self.form_class)
        })
        return kwargs


class PublishedVideoView(DetailView):
    model = Published
