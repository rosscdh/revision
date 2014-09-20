# -*- coding: utf-8 -*-
from django.conf import settings
import heywatch

import logging
logger = logging.getLogger('django.request')

HW = heywatch.API(settings.get('HEYWATCH_USERNAME'), settings.get('HEYWATCH_PASS'))


class NewProjectService(object):
    """
    Accept url to video
    Accept file upload
        send to heywatch transcoder for processing
        rely on heywatch webhooks to update status in RT in the view
        record heywatch webhook progress
        update video_url on completed
    """