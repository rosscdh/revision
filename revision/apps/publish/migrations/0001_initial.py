# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import uuidfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Published',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('slug', uuidfield.fields.UUIDField(db_index=True, unique=True, max_length=32, editable=False, blank=True)),
                ('is_published', models.BooleanField(default=True, db_index=True)),
                ('payment', models.DecimalField(default=0.0, max_digits=5, decimal_places=2, db_index=True)),
                ('data', jsonfield.fields.JSONField(default={})),
                ('video', models.ForeignKey(to='project.Video')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
