# -*- coding: utf-8 -*-
from django.db import models
from django.db.models.signals import pre_save
from django.core.urlresolvers import reverse_lazy

from ..signals import ensure_project_slug

from jsonfield import JSONField


class Project(models.Model):
    slug = models.SlugField(blank=True)  # blank to allow slug to be auto-generated
    name = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now=False,
                                        auto_now_add=True,
                                        db_index=True)
    collaborators = models.ManyToManyField('auth.User',
                                           through='project.ProjectCollaborator',
                                           through_fields=('project', 'user'))

    client = models.ForeignKey('client.Client', null=True, blank=True)

    data = JSONField(default={})

    def __unicode__(self):
        return u'%s' % self.name

    def get_absolute_url(self):
        return reverse_lazy('project:detail', kwargs={'slug': self.slug})

#
# Signals
#
pre_save.connect(ensure_project_slug, sender=Project, dispatch_uid='project.pre_save.ensure_project_slug')
