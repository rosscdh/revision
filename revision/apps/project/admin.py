from django.contrib import admin

from .models import Project, ProjectCollaborator, Video

admin.site.register([Project, ProjectCollaborator, Video])