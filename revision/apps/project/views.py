# -*- coding: utf-8 -*-
from django.views.generic import (CreateView,
                                  DetailView,
                                  ListView,)

from django.views.generic.edit import FormMixin

from django.utils.safestring import mark_safe

from rest_framework.renderers import JSONRenderer

from .api.serializers import (ProjectSerializer,
                              VideoSerializer,
                              CommentSerializer)
from .forms import ProjectForm
from .models import Project, Video


class ProjectListView(ListView,
                      FormMixin):
    model = Project
    form_class = ProjectForm

    def get_context_data(self, **kwargs):
        kwargs = super(ProjectListView, self).get_context_data(**kwargs)
        kwargs.update({
            'form': self.get_form(form_class=self.form_class)
        })
        return kwargs
    def get_queryset(self, **kwargs):
        #queryset = self.model._default_manager.all()
        queryset = self.model._default_manager.filter(collaborators__in=[self.request.user])
        return queryset

    @property
    def project_json(self):
        return JSONRenderer().render(ProjectSerializer(self.get_queryset(), many=True).data)


class ProjectCreateView(CreateView):
    model = Project
    form_class = ProjectForm


class ProjectDetailView(DetailView):
    model = Project

    @property
    def project_json(self):
        return JSONRenderer().render(ProjectSerializer(self.object).data)

    @property
    def video_json(self):
        return JSONRenderer().render(VideoSerializer(self.current_video).data)

    @property
    def current_video(self):
        version_slug = self.kwargs.get('version_slug', None)
        self._current_video = self.object.video_set.get(slug=version_slug) if version_slug is not None else self.object.video_set.all().first()
        return self._current_video


class VideoSubtitleView(ProjectDetailView):
    template_name = 'project/video_subtitles.html'

    @property
    def subtitles(self):
        self.object = self.get_object()
        subtitles = self.current_video.comments#[s for s in self.current_video.comments if s.get('comment_type') == 'subtitle']

        for i, s in enumerate(subtitles):
            progress = float(s.get('progress'))
            subtitle_start_progress = Video.secs_to_stamp(progress)

            delay_secs = int(s.get('secs', 4))
            
            subtitle_end_progress = Video.secs_to_stamp(progress + delay_secs)  # delay 4 seconds @TODO make this configurable
            subtitles[i]['subtitle_range'] = mark_safe('%s --> %s' % (subtitle_start_progress, subtitle_end_progress))

        return subtitles


class ProjectChronicleView(ProjectDetailView):
    model = Project
    template_name = 'project/project_chronicle.html'

    @property
    def project_comments_json(self):
        comments = []

        for v in self.object.video_set.all():
            comments += v.comments_by_id_reversed

        return JSONRenderer().render(CommentSerializer(comments, many=True).data)

