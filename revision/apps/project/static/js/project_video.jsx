/** @jsx React.DOM */
'use strict';
/**
* Video controls
*
*/

var CreateVideoView = React.createClass({
    handleDeleteVideo: function ( event ) {

        VideoResource.destroy( Video.slug ).defer().done(function ( data ) {
            window.location = Project.detail_url;
        });

    },
    handleChronicleClick: function ( event ) {
        window.location = Links.chronicle;
    },
    render: function () {
        var VideoUploader = <VideoUploaderView uploader_config={UploaderConfig}
                                               project={this.props.project} />
        return (<span>
            <span onClick={this.handleChronicleClick} className="btn btn-primary btn-small pull-right">
                <i className="glyphicon glyphicon-road"></i>
                <span>Activity Chronicle</span>
            </span>

            <span onClick={this.handleDeleteVideo} className="btn btn-danger btn-small">
                <i className="glyphicon glyphicon-remove"></i>
                <span>Delete Video</span>
            </span>&nbsp;
            {VideoUploader}
        </span>);
    }
});
