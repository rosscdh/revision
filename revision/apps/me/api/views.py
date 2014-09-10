# -*- coding: utf-8 -*-
from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status as http_status

from revision.apps.project.models import Project

from .serializers import (UserSerializer,
                          CollaboratorSerializer,)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'email'
    lookup_url_kwarg = 'email'
    filter_fields = ('email', 'username')
    allowed_methods = ('get', 'options', 'head',)


class CollaboratorEndpoint(generics.ListCreateAPIView,
                           generics.RetrieveDestroyAPIView):
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    queryset = Project.objects.all()
    serializer_class = CollaboratorSerializer

    def list(self, request, **kwargs):
        self.project = self.get_object()
        collaborator_serializer = self.get_serializer(self.project.projectcollaborators_set.all(), many=True)
        headers = self.get_success_headers(collaborator_serializer)
        return Response(collaborator_serializer.data, status=http_status.HTTP_200_OK, headers=headers)

    def create(self, request, **kwargs):
        import pdb;pdb.set_trace()

    def retrieve(self, request, **kwargs):
        import pdb;pdb.set_trace()

    def destroy(self, request, **kwargs):
        import pdb;pdb.set_trace()