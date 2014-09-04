# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import revision.apps.project.mixins
import uuidfield.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('slug', models.SlugField(blank=True)),
                ('name', models.CharField(max_length=255)),
                ('date_created', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('data', jsonfield.fields.JSONField(default={})),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('slug', uuidfield.fields.UUIDField(db_index=True, unique=True, max_length=32, editable=False, blank=True)),
                ('name', models.CharField(max_length=255)),
                ('video_url', models.URLField(db_index=True)),
                ('video_type', models.IntegerField(db_index=True, choices=[(1, b'video/mp4')])),
                ('data', jsonfield.fields.JSONField(default={})),
                ('project', models.ForeignKey(to='project.Project')),
            ],
            options={
                'ordering': ['-id'],
            },
            bases=(revision.apps.project.mixins.VideoCommentsMixin, models.Model),
        ),
    ]
