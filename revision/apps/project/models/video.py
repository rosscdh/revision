# -*- coding: utf-8 -*-
from django.db import models
from django.core.urlresolvers import reverse_lazy

from revision.utils import get_namedtuple_choices

from ..mixins import VideoCommentsMixin

from jsonfield import JSONField
from uuidfield import UUIDField

import math

BASE_VIDEO_TYPES = get_namedtuple_choices('BASE_VIDEO_TYPES', (
    (1, 'video_mp4', 'video/mp4'),
))


class Video(VideoCommentsMixin,
            models.Model):
    """
    Video Version model
    """
    VIDEO_TYPES = BASE_VIDEO_TYPES

    slug = UUIDField(auto=True,
                     db_index=True)
    project = models.ForeignKey('project.Project')
    name = models.CharField(max_length=255)
    video_url = models.URLField(db_index=True)
    video_type = models.IntegerField(choices=VIDEO_TYPES.get_choices(),
                                     db_index=True)
    data = JSONField(default={})

    class Meta:
        ordering = ['-id']

    @classmethod
    def secs_to_stamp(cls, secs):
        secs, part = str(secs).split('.')
        secs = int(secs)
        part = int(part[0:3])
        minutes = math.floor(secs / 60)
        seconds = round(secs - minutes * 60, 2)
        hours = math.floor(secs / 3600)
        #time = time - hours * 3600;
        return '%02d:%02d:%02d.%03d' % (hours, minutes, seconds, part)

    @property
    def display_type(self):
        return self.VIDEO_TYPES.get_desc_by_value(self.video_type)

    def subtitles_url(self):
        return reverse_lazy('project:video_subtitles_url', kwargs={'slug': self.project.slug, 'version_slug': self.slug})

    def get_absolute_url(self):
        return reverse_lazy('project:with_video_detail', kwargs={'slug': self.project.slug, 'version_slug': str(self.slug)})