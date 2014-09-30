# -*- coding: utf-8 -*-
from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import ButtonHolder, Div, Field, Fieldset, HTML, Layout, Submit

from parsley.decorators import parsleyfy

from revision.apps.public.templatetags.revision_tags import ABSOLUTE_BASE_URL

from .models import Published


@parsleyfy
class VideoSettingsForm(forms.ModelForm):
    is_published = forms.BooleanField(initial=True, required=False)

    payment = forms.DecimalField(label='Pay Amount',
                                 help_text='Enter an amount subscribers should pay to view this video. 0.00 will be free-to-view',
                                 initial=0.00)

    class Meta:
        model = Published
        exclude = ('video', 'data',)

    def __init__(self, **kwargs):
        super(VideoSettingsForm, self).__init__(**kwargs)

        self.video = self.instance.video

        link = ABSOLUTE_BASE_URL(path=self.instance.get_absolute_url())

        self.helper = FormHelper()

        self.helper.attrs = {
            'parsley-validate': '',
        }
        self.helper.form_show_errors = False

        self.helper.layout = Layout(
            HTML('{% include "partials/form-errors.html" with form=form %}'),
            Fieldset(
                '',
                Field('is_published', css_class='input-hg'),
                Field('payment', css_class='input-hg'),
                Div(
                    HTML('<small><b>Published at:</b>&nbsp;<a href="{link}">{link_name}</a></small>'.format(link=link, link_name=link)),
                    css_class='form-group'
                ),
            ),
            ButtonHolder(
                Submit('submit', 'Save', css_class='btn btn-primary btn-lg'),
                css_class='form-group'
            )
        )
        