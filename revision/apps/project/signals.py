# -*- coding: utf-8 -*-
from django.template.defaultfilters import slugify

from revision.utils import _model_slug_exists

import uuid
import logging
logger = logging.getLogger('django.request')


def ensure_project_slug(sender, instance, **kwargs):
    """
    signal to handle creating the workspace slug
    """
    if instance.slug in [None, '']:

        final_slug = slugify(instance.name)[:32]

        while _model_slug_exists(model=instance.__class__.objects.model, slug=final_slug):
            logger.info('Workspace %s exists, trying to create another' % final_slug)
            slug = '%s-%s' % (final_slug, uuid.uuid4().get_hex()[:4])
            slug = slug[:30]
            final_slug = slugify(slug)

        instance.slug = final_slug
