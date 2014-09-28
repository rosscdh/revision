/** @jsx React.DOM */
'use strict';

var VideoUploaderView = React.createClass({
    componentDidMount: function () {
        var self = this;

        // var uploadButton = $('<button/>')
        //     .addClass('btn btn-primary')
        //     .prop('disabled', true)
        //     .text('Processing...')
        //     .on('click', function () {
        //         var $this = $(this),
        //             data = $this.data();
        //         $this
        //             .off('click')
        //             .text('Abort')
        //             .on('click', function () {
        //                 $this.remove();
        //                 data.abort();
        //             });
        //         data.submit().always(function () {
        //             $this.remove();
        //         });
        //     });

        $(this.refs.fileupload.getDOMNode()).fileupload({
            url: Links.upload_video,
            dataType: 'json',
            //autoUpload: true,
            acceptFileTypes: /(\.|\/)(avi|mov|ogg|mp4)$/i,
            maxFileSize: 300000000, // 300 MB
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            // disableImageResize: /Android(?!.*Chrome)|Opera/
            //     .test(window.navigator.userAgent),
            // previewMaxWidth: 100,
            // previewMaxHeight: 100,
            // previewCrop: true
            formData: function (form) {
                return $.merge(form.serializeArray(), [{"name": "csrfmiddlewaretoken", "value": $('input[name=csrfmiddlewaretoken]').val()}]);
            },
        }).on('fileuploadadd', function (e, data) {

        }).on('fileuploadprocessalways', function (e, data) {

        }).on('fileuploadprogressall', function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        }).on('fileuploaddone', function (e, data) {

        }).on('fileuploadfail', function (e, data) {
        });
        // }).prop('disabled', !$.support.fileInput)
        //     .parent().addClass($.support.fileInput ? undefined : 'disabled');
    },
    render: function () {
        return (<span>
            <span className="btn btn-success fileinput-button">
                <i className="glyphicon glyphicon-plus"></i>
                <span>Add file</span>
                <input id="fileupload" data="blueimp-fileupload" ref="fileupload" type="file" name="video"/>
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