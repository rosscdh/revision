# -*- coding: utf-8 -*-
from django import forms

from .models import Video

from crispy_forms.layout import Button, Field, Layout
from parsley.decorators import parsleyfy


@parsleyfy
class VideoForm(forms.ModelForm):
    class Meta:
        exclude = ('project', 'video_type', 'data',)
        model = Video
