/** @jsx React.DOM */
'use strict';
/**
* Video controls
*
*/
var VideoFormModal = React.createClass({
    getInitialState: function () {
        return {
            'project': Project,
            'available_types': ['Comment', 'Subtitle', 'Sketch']
        }
    },
    onSubmitForm: function ( event ) {
        var self = this;

        var post_params = {
            'project': this.state.project.url,
            'name': this.refs.name.getDOMNode().value.trim(),
            'video_url': this.refs.video_url.getDOMNode().value.trim(),
        };

        VideoResource.create( post_params ).defer().done(function ( video_data ) {

            // self.props.onVideoUpdate( video_data );
            // $( '#modal-new-video' ).modal('hide');
            document.location = video_data.video_url;

        });
        return false;
    },
    render: function () {

        return (
        <div id="modal-new-video" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="modal-new-video-help" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                    <h4 className="modal-title" id="myModalLabel">New Version</h4>
                </div>
                <div className="modal-body">
                    <div className="row">
                        <form onSubmit={this.onSubmitForm}>
                            <label>Name:</label><input ref="name" maxLength="255" name="name" type="text" />
                            <label>Video url:</label><input ref="video_url" maxLength="200" name="video_url" type="url" />
                            <input type="submit" value="Create" />
                        </form>
                    </div>
                </div>
            </div>
          </div>
        </div>
        );
    }
});

var CreateVideoView = React.createClass({
    render: function () {
        return (<span>
            <a href="#" className="btn btn-success" data-toggle="modal" data-target="#modal-new-video">New Video</a>
        </span>);
    }
});