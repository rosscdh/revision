# -*- coding: utf-8 -*-


class VideoCommentsMixin(object):
    """
    Mixin to allow adding and removing of comments
    """
    @property
    def comments(self):
        return self.data.get('comments', [])

    @comments.setter
    def comments(self, value):
        assert type(value) == list, '%s.comments must be a list []' % self.__class__.__name__
        self.data['comments'] = value

    def add_comment(self, comment, **kwargs):
        comments = self.comments

        kwargs.update({
            'comment': comment
        })
        # append the object to the list
        comments.append(kwargs)
        # set the comment value in data vai the setter
        self.comments = comments
