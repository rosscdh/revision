# -*- coding: utf-8 -*-
from rest_framework import viewsets
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status as http_status

from ..models import Project, Video
from .serializers import (ProjectSerializer,
                          VideoSerializer,
                          CommentSerializer,)


class ProjectViewSet(viewsets.ModelViewSet):
    """
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    lookup_field = 'slug'


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
        return int(self.kwargs.get('pk')) ## minus 1 to account for list index

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
        try:
            index, data = [(index, c.copy()) for index, c in enumerate(self.object.comments) if c.get('pk') == self.pk][0]
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
