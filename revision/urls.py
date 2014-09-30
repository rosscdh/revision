# -*- coding: utf-8 -*-
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import patterns, include, url

from django.views.generic import TemplateView

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),

    url(r'^api/v1/', include('revision.api.urls')),

    url(r'^me/password/', include('password_reset.urls')),
    url(r'^me/', include('revision.apps.me.urls', namespace='me')),

    # Payments
    url(r'^payments/', include('payments.urls')),

    url(r'^pub/', include('revision.apps.publish.urls', namespace='publish')),
    url(r'^p/', include('revision.apps.project.urls', namespace='project')),
    url(r'^', include('revision.apps.public.urls', namespace='public')),
)

if settings.DEBUG is True:
    # Add the MEDIA_URL to the dev environment
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
