'use strict';


var VideoResource = Resource.createClass({
    uri: '/api/v1/videos/',
    base_url: function ( params ) {
        return this.uri + '{video_slug}/'.assign(params || this.params);
    },
    create: function ( post_params ) {
        return this.process( this.uri, 'POST', post_params );
    },
    detail: function () {
        var uri = this.base_url();
        return this.process( uri, 'GET' );
    },
});
