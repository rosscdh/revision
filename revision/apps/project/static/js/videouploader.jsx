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

        self.state.uploader.add({
            name: config.aws_path + file.name,
            file: file,
            progress: function ( progress ) {
                // console.log('progress' + progress);
                var percent = Math.round(progress * 100, 2)
                $('div#progress .progress-bar').width(percent+'%');
            },
            complete: function () {
console.log('complete');
            },
        });
    },
    render: function () {
        console.log(this.state.uploader)
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
            <div id="files" className="files"></div>
        </span>);
    }
});