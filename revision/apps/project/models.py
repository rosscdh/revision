# -*- coding: utf-8 -*-
from django.db import models

from jsonfield import JSONField
from uuidfield import UUIDField


class Project(models.Model):
    slug = UUIDField(auto=True,
                     db_index=True)

    name = models.CharField(max_length=255)

    date_created = models.DateTimeField(auto_now=False,
                                        auto_now_add=True,
                                        db_index=True)

    # versions = models.ManyToManyField('auth.User')
    # collaborators = models.ManyToManyField('version.Version')

    data = JSONField(default={})