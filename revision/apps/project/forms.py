# -*- coding: utf-8 -*-
from django import forms

from .models import (Project, Video,)

from crispy_forms.layout import Button, Field, Layout
from parsley.decorators import parsleyfy


@parsleyfy
class ProjectForm(forms.ModelForm):

    client = forms.CharField(
        error_messages={
            'required': "Client name can not be blank."
        },
        help_text='',
        label='Client name',
        required=True,
        max_length=200,
        widget=forms.TextInput(attrs={
            'autocomplete': 'off',
            'placeholder': 'Acme Inc',
            'size': '40',
            # Typeahead
            'data-items': '4',
            'data-provide': 'typeahead',
            'data-source': '[]'
        })
    )

    class Meta:
        model = Project
        exclude = ('slug', 'collaborators', 'data',)


@parsleyfy
class VideoForm(forms.ModelForm):
    class Meta:
        exclude = ('project', 'video_type', 'data',)
        model = Video
