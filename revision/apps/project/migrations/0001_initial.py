# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import revision.apps.project.models.video
import revision.apps.project.mixins
import jsonfield.fields
from django.conf import settings
import uuidfield.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('client', '0001_initial'),
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
                ('client', models.ForeignKey(blank=True, to='client.Client', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ProjectCollaborator',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_project_owner', models.BooleanField(default=False, db_index=True)),
                ('data', jsonfield.fields.JSONField(default={})),
                ('role', models.IntegerField(default=2, db_index=True, choices=[(0, b'No Access'), (1, b'Owner'), (2, b'Client'), (3, b'Colleague'), (4, b'3rd Party')])),
                ('project', models.ForeignKey(to='project.Project')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
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
                ('video', models.FileField(max_length=255, null=True, upload_to=revision.apps.project.models.video._upload_video, blank=True)),
                ('video_url', models.URLField(db_index=True)),
                ('video_type', models.IntegerField(default=1, db_index=True, choices=[(1, b'video/mp4'), (2, b'video/mov'), (3, b'video/ogg')])),
                ('data', jsonfield.fields.JSONField(default={})),
                ('project', models.ForeignKey(to='project.Project')),
            ],
            options={
                'ordering': ['-id'],
            },
            bases=(revision.apps.project.mixins.VideoCommentsMixin, models.Model),
        ),
        migrations.AddField(
            model_name='project',
            name='collaborators',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL, through='project.ProjectCollaborator'),
            preserve_default=True,
        ),
    ]
