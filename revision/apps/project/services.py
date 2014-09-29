# -*- coding: utf-8 -*-
from django.conf import settings
import boto.elastictranscoder
# import heywatch

import logging
logger = logging.getLogger('django.request')

# HW = heywatch.API(settings.get('HEYWATCH_USERNAME'), settings.get('HEYWATCH_PASS'))
DEFAULT_REGION = getattr(settings, 'AWS_DEFAULT_REGION', 'eu-west-1')
PIPELINE_ID = getattr(settings, 'AWS_PIPELINE_ID', '1411982976186-zqkpv5')


class TranscodeVideo(object):
    """
    Transcode a video located on s3 to a new valid streaming file
    **assume** the video is already on s3
    """
    def __init__(self, video, **kwargs):
        self.video = video
        self.region = kwargs.get('region', DEFAULT_REGION)
        self.pipeline_id = kwargs.get('pipeline_id', PIPELINE_ID)

        self.transcode = boto.elastictranscoder.connect_to_region(self.region)

        self.input = {
            'Key': 'foo.webm',
            'Container': 'webm',
            'AspectRatio': 'auto',
            'FrameRate': 'auto',
            'Resolution': 'auto',
            'Interlaced': 'auto'
        }
        self.output = [
            {
                'Key': 'bar.mp4',
                'PresetId': '1351620000001-000010',
                'Rotate': 'auto',
                'ThumbnailPattern': '',
            }
        ]
    def process(self, **kwargs):
        self.transcode.create_job(self.pipeline_id,
                                  input_name=self.input,
                                  outputs=self.output)