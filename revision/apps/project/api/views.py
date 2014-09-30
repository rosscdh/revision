# -*- coding: utf-8 -*-
from django.conf import settings

from rest_framework import viewsets
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as http_status
from rest_framework.renderers import StaticHTMLRenderer

from revision.decorators import (mutable_request, valid_request_filesize)

from revision.apps.client.models import Client

from ..models import (Project,
                      Video,
                      ProjectCollaborator)
from .serializers import (ProjectSerializer,
                          VideoSerializer,
                          CommentSerializer,)

import urllib2
import base64
import hmac
import sha


class ProjectViewSet(viewsets.ModelViewSet):
    """
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'

    def pre_save(self, obj):
        client_name = self.request.POST.get('client', None)
        if client_name:
            client, is_new = Client.objects.get_or_create(name=client_name, owner=self.request.user)
            obj.client = client

        return super(ProjectViewSet, self).pre_save(obj=obj)

    def post_save(self, obj, created):
        collaborator, is_new = ProjectCollaborator.objects.get_or_create(user=self.request.user, project=obj)
        return super(ProjectViewSet, self).post_save(obj, created=created)


class ProjectUploadVideoEndpoint(generics.CreateAPIView):
    """
    Upload a video to a project
    """
    queryset = Project.objects.all()
    serializer_class = VideoSerializer
    lookup_field = 'slug'

    @mutable_request
    @valid_request_filesize
    def create(self, request, **kwargs):
        self.project = self.get_object()
        project = ProjectSerializer(self.project).data
        request_data = request.DATA.copy()

        request_data.update({
            'project': project.get('url'),
            'video_url': urllib2.unquote(request_data.get('video_url'))
        })
        serializer = self.get_serializer(data=request_data, files=request.FILES)

        if serializer.is_valid():
            self.pre_save(serializer.object)
            self.object = serializer.save(force_insert=True)
            self.post_save(self.object, created=True)

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=http_status.HTTP_201_CREATED,
                            headers=headers)

        return Response(serializer.errors, status=http_status.HTTP_400_BAD_REQUEST)

    def post_save(self, obj, created):
        """
        extract just the s3 key name from the url
        """
        # arse into parts
        video_url_parts = urllib2.urlparse.urlparse(obj.video_url)
        # remove the bucket name
        video_url_path = video_url_parts.path.replace('/%s/' % settings.AWS_STORAGE_BUCKET_NAME, '')

        self.object.video = video_url_path  # save the s3 url path to file object
        obj.save(update_fields=['video'])

        return super(ProjectUploadVideoEndpoint, self).post_save(obj, created=created)


class VideoViewSet(viewsets.ModelViewSet):
    """
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    lookup_field = 'slug'


class VideoCommentsEndpoint(generics.ListCreateAPIView):
    """
    Comments for a specific video
    """
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    paginate_by = 100
    allowed_methods = ('get', 'post', 'options', 'head',)

    def list(self, request, **kwargs):
        self.object = self.get_object()
        serializer = CommentSerializer
        return Response(serializer([item for item in self.object.comments_by_id_reversed if item.get('is_deleted', False) is False], many=True).data)

    def create(self, request, **kwargs):
        self.object = self.get_object()
        comment = CommentSerializer(data=request.DATA)
        if comment.is_valid() is True:
            data = comment.data.copy()

            self.object.add_comment(**data)
            self.object.save(update_fields=['data'])

            # the comment is created via a signal, so we do NOT have the comment-object with its id directly.
            return Response(self.object.comments[-1], status=http_status.HTTP_201_CREATED)
        else:
            return Response(status=http_status.HTTP_400_BAD_REQUEST, data={'errors': comment.errors})


class VideoCommentDetailEndpoint(generics.RetrieveUpdateDestroyAPIView):
    """
    A specific single Comment for a specific video
    """
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    allowed_methods = ('get', 'patch', 'delete', 'options', 'head',)

    @property
    def pk(self):
        return int(self.kwargs.get('pk')) - 1 ## minus 1 to account for list index

    def retrieve(self, request, **kwargs):
        self.object = self.get_object()
        comment = CommentSerializer(self.object.comments[self.pk])
        return Response(comment.data, status=http_status.HTTP_200_OK)

    def update(self, request, **kwargs):
        self.object = self.get_object()

        try:
            data = self.object.comments[self.pk]
        except IndexError:
            return Response(status=http_status.HTTP_404_NOT_FOUND, data={'errors': 'Comment %d: Does not exist' % self.pk})

        data.update({
            'comment': request.DATA.get('comment', data.get('comment')),  # allow update of only is_deleted items without changing comment
            'is_deleted': request.DATA.get('is_deleted', data.get('is_deleted', False)),  # allow update of is_deleted items
            'secs': int(self.request.DATA.get('secs', 0)),
        })
        comment = CommentSerializer(data, data=data)

        if comment.is_valid() is True:
            self.object.comments[self.pk] = comment.data
            self.object.save(update_fields=['data'])
            return Response(comment.data, status=http_status.HTTP_200_OK)
        else:
            return Response(status=http_status.HTTP_400_BAD_REQUEST, data={'errors': comment.errors})

    def destroy(self, request, **kwargs):
        self.object = self.get_object()
        pk = self.pk + 1  # account for - 1
        try:
            index, data = [(index, c.copy()) for index, c in enumerate(self.object.comments) if c.get('pk') == pk][0]
        except IndexError:
            return Response(status=http_status.HTTP_404_NOT_FOUND, data={'errors': 'Comment %d: Does not exist' % self.pk})

        data.update({
            'is_deleted': True
        })
        comment = CommentSerializer(data, data=data)

        if comment.is_valid() is True:
            # copy the comments so we can modify them
            comments = self.object.comments
            # update the copy
            comments[index] = comment.data
            # set the new comments
            self.object.comments = comments
            # resave
            self.object.save(update_fields=['data'])

            return Response(comment.data, status=http_status.HTTP_200_OK)

        else:
            return Response(status=http_status.HTTP_400_BAD_REQUEST, data={'errors': comment.errors})


class S3SignatureEndpoint(APIView):
    """
    Provide a signed key for the sending object
    """
    renderer_classes = (StaticHTMLRenderer,)

    def get(self, request, **kwargs):
        to_sign = str(request.GET.get('to_sign'))
        signature = base64.b64encode(hmac.new(settings.AWS_SECRET_ACCESS_KEY, to_sign, sha).digest())

        return Response(signature, status=http_status.HTTP_200_OK)
