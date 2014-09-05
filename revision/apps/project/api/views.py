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
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    paginate_by = 100
    allowed_methods = ('get', 'post', 'options', 'head',)

    def list(self, request, **kwargs):
        self.object = self.get_object()
        serializer = CommentSerializer
        return Response(serializer(self.object.comments, many=True).data)

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
            return Response(status=http_status.HTTP_400_BAD_REQUEST, data={'reason': 'You should send a comment.'})


class VideoCommentDetailEndpoint(generics.RetrieveUpdateDestroyAPIView):
    """
    A specific single Comment for a specific video
    """
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    allowed_methods = ('get', 'patch', 'delete', 'options', 'head',)

    def retrieve(self, request, **kwargs):
        import pdb;pdb.set_trace()

    def update(self, request, **kwargs):
        import pdb;pdb.set_trace()

    def destroy(self, request, **kwargs):
        import pdb;pdb.set_trace()