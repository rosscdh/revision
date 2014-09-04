# -*- coding: utf-8 -*-
from rest_framework import serializers

from ..models import Project, Video


class VideoSerializer(serializers.HyperlinkedModelSerializer):
    comments = serializers.SerializerMethodField('get_comments')

    class Meta:
        model = Video
        lookup_field = 'slug'

    def get_comments(self, obj):
        return obj.comments


class VideoSerializerLite(VideoSerializer):
    url = serializers.Field(source='get_absolute_url')

    class Meta(VideoSerializer.Meta):
        fields = ('name', 'url', 'video_url',)


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    date_created = serializers.DateTimeField(read_only=True, format='iso-8601')
    collaborators = serializers.SerializerMethodField('get_collaborators')
    versions = serializers.SerializerMethodField('get_versions')

    class Meta:
        model = Project
        lookup_field = 'slug'
        exclude = ('data',)

    def get_versions(self, obj):
        return VideoSerializerLite(obj.video_set.all(), many=True).data

    def get_collaborators(self, obj):
        #
        # Make use of the comment serializer here
        #
        return [
          {'name': 'Ross Crawford', 'initials': 'RC', 'user_class': 'owner'},
          {'name': 'Kris Müller', 'initials': 'KM', 'user_class': 'customer'},
          {'name': 'Michael Pedersen', 'initials': 'MP', 'user_class': 'colleague'}
        ]
