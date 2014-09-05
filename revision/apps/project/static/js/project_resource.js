'use strict';


var VideoResource = Resource.createClass({
  base_url: function () {
    return '/api/v1/videos/{video_slug}/'.assign(this.params);
  },
  detail: function () {
    var uri = this.base_url();
    return this.process( uri, 'GET' );
  },
});


var CommentResource = Resource.createClass({
  base_url: function () {
    return '/api/v1/videos/{video_slug}/comments/'.assign(this.params);
  },
  list: function () {
    var uri = this.base_url();
    return this.process( uri, 'GET' );
  },
  create: function ( comment, comment_type, comment_by, progress ) {
    var uri = this.base_url();
    return this.process( uri, 'POST', {'comment': comment, 'comment_type': comment_type, 'comment_by': comment_by, 'progress': progress} );
  },
  detail: function ( comment_pk ) {
    var uri = this.base_url() + comment_pk + '/';
    return this.process( uri, 'GET' );
  },
  destroy: function ( comment_pk ) {
    var uri = this.base_url() + comment_pk + '/';
    return this.process( uri, 'DELETE', {'is_deleted': true});
  },
});
