# -*- coding: utf-8 -*-
from django.core.urlresolvers import reverse_lazy

from rest_framework import serializers

from revision.apps.me.api.serializers import CollaboratorSerializer
from ..models import Project, Video

import datetime
import dateutil.parser


def _get_date_now():
    return datetime.datetime.utcnow().isoformat('T')


class CustomDateTimeField(serializers.DateTimeField):
    def from_native(self, value):
        return datetime.datetime(value).isoformat('T')

    def to_native(self, value):
        if value is None:
            value = _get_date_now()
        return dateutil.parser.parse(value)


class CommentSerializer(serializers.Serializer):
    pk = serializers.IntegerField(read_only=True)
    uuid = serializers.CharField(read_only=True)
    comment_type = serializers.CharField()
    comment = serializers.CharField()
    comment_by = serializers.CharField()
    date_of = CustomDateTimeField(default=_get_date_now, read_only=True, format='iso-8601')
    progress = serializers.DecimalField(max_digits=10, decimal_places=6)

    secs = serializers.IntegerField(required=False, default=3)

    is_deleted = serializers.BooleanField(default=False)


class VideoSerializer(serializers.HyperlinkedModelSerializer):
    slug = serializers.Field(source='slug')
    comments = serializers.SerializerMethodField('get_comments')
    video_type = serializers.Field(source='display_type')
    video_subtitles_url = serializers.Field(source='subtitles_url')
    video_view_url = serializers.Field(source='get_absolute_url')
    video_url = serializers.URLField()

    class Meta:
        model = Video
        lookup_field = 'slug'
        exclude = ('data',)

    def get_comments(self, obj):
        return CommentSerializer(obj.comments_by_id_reversed, many=True).data


class VideoSerializerLite(VideoSerializer):
    url = serializers.Field(source='get_absolute_url')

    class Meta(VideoSerializer.Meta):
        fields = ('name', 'slug', 'url', 'video_url', 'video_subtitles_url',)


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    date_created = serializers.DateTimeField(read_only=True, format='iso-8601')
    collaborators = serializers.SerializerMethodField('get_collaborators')
    versions = serializers.SerializerMethodField('get_versions')
    client = serializers.SerializerMethodField('get_client')

    detail_url = serializers.SerializerMethodField('get_detail_url')

    class Meta:
        model = Project
        lookup_field = 'slug'
        exclude = ('data',)

    def get_versions(self, obj):
        return VideoSerializerLite(obj.video_set.all(), many=True).data

    def get_client(self, obj):
        return {
            'name': obj.client.name
        }

    def get_detail_url(self, obj):
        return obj.get_absolute_url()

    def get_collaborators(self, obj):
        return CollaboratorSerializer(obj.projectcollaborator_set.all(), many=True).data
