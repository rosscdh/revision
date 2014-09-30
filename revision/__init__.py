# -*- coding: utf-8 -*-
from django.conf import settings
from django.core.files.storage import FileSystemStorage

from storages.backends.s3boto import S3BotoStorage

import os


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name):
        """
        Returns a filename that's free on the target storage system, and
        available for new content to be written to.
        """
        # If the filename already exists, remove it as if it was a true file system
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name


def _managed_S3BotoStorage():
    return OverwriteStorage() if settings.PROJECT_ENVIRONMENT in ['test'] else S3BotoStorage()
