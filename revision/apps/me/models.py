# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User

from .mixins import EmailIsValidatedMixin
from .managers import CustomUserManager

from jsonfield import JSONField

import logging
logger = logging.getLogger('django.request')


class UserProfile(EmailIsValidatedMixin,
                  models.Model):
    """
    Base User Profile, where we store all the interesting information about
    users
    """
    user = models.OneToOneField('auth.User',
                                unique=True,
                                related_name='profile')

    data = JSONField(default={})

    def __unicode__(self):
        return '%s <%s>' % (self.user.get_full_name(), self.user.email)


#
# Automatically create profile object for each new user model
#


def _get_or_create_user_profile(user):
    # set the profile
    try:
        # added like this so django noobs can see the result of get_or_create
        profile, is_new = UserProfile.objects.get_or_create(user=user)
        return (profile, is_new,)

    except Exception as e:
        logger.critical('transaction.atomic() integrity error: %s' % e)

    return (None, None,)


#
# User model overrides
#

# used to trigger profile creation by accidental refernce. Rather use the _create_user_profile def above
User.profile = property(lambda u: _get_or_create_user_profile(user=u)[0])
User.add_to_class('objects', CustomUserManager())
