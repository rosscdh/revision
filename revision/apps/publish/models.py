# -*- coding: utf-8 -*-
from django.db import models
from django.core.urlresolvers import reverse

from uuidfield import UUIDField
from jsonfield import JSONField


class Published(models.Model):
    slug = UUIDField(auto=True,
                     db_index=True)
    video = models.ForeignKey('project.Video')

    is_published = models.BooleanField(default=True,
                                       db_index=True)
    payment = models.DecimalField(default=0.00,
                                  max_digits=5,
                                  decimal_places=2,
                                  db_index=True)

    data = JSONField(default={})

    @property
    def stripe_payment_amount(self):
      """
      Stripe wants the amount in cents
      """
      return round(self.payment * 100, 0)

    def get_absolute_url(self):
        return reverse('publish:view', kwargs={'slug': self.slug})