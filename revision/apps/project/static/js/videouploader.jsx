/** @jsx React.DOM */
'use strict';

var VideoUploaderView = React.createClass({
    getInitialState: function() {
        return {
            'uploader': new Evaporate(this.props.uploader_config),
        }
    },
    componentDidMount: function () {
        var self = this;
    },
    handleNewFile: function ( event ) {
        event.preventDefault();

        var self = this;
        var config = this.props.uploader_config;
        var file = event.target.files[0];
        var progress = $('div#progress');
        var progress_bar = progress.find('div.progress-bar');
        var progress_conversion = $('div#progress-conversion');
        var progress_conversion_bar = progress_conversion.find('div.progress-bar');

        self.state.uploader.add({
            name: config.aws_path + file.name,
            file: file,
            progress: function ( progress ) {
                console.log('progress:' + progress);
                var percent = Math.round(progress * 100, 2)
                progress_bar.width(percent+'%');
                progress_conversion.hide();
            },
            complete: function ( data ) {
                // post the new video event
                var response = $(data.responseText);
                var location = response.find('Location');
                // video_url

                var video_object = {
                    name: file.name,
                    video_url: location.text(),
                    //video_type: file.type
                };

                VideoResource.create( video_object ).defer().done(function ( data ) {
                    console.log(data)
                    progress_bar.width('0%');

                    progress_conversion_bar.width('0%');
                    progress_conversion.show();

                });
            },
        });
    },
    render: function () {
        return (<span>
            <span className="btn btn-success fileinput-button">
                <i className="glyphicon glyphicon-plus"></i>
                <span>Add file</span>
                <input id="fileupload" onChange={this.handleNewFile} ref="fileupload" type="file" name="video"/>
            </span>
            <br/>
            <br/>
            <div id="progress" className="progress">
                <div className="progress-bar progress-bar-success"></div>
            </div>
            <div id="progress-conversion" className="progress hide">
                <div className="progress-bar progress-bar-success"></div>
            </div>
            <div id="files" className="files"></div>
        </span>);
    }
});