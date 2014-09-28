/** @jsx React.DOM */
'use strict';

var VideoUploaderView = React.createClass({displayName: 'VideoUploaderView',
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
        });
        // .on('fileuploadadd', function (e, data) {

        //     data.context = $('<div/>').appendTo('#files');
        //     $.each(data.files, function (index, file) {
        //         var node = $('<p/>')
        //                 .append($('<span/>').text(file.name));
        //         if (!index) {
        //             node
        //                 .append('<br>')
        //                 .append(uploadButton.clone(true).data(data));
        //         }
        //         node.appendTo(data.context);
        //     });
        // }).on('fileuploadprocessalways', function (e, data) {
        //     var index = data.index,
        //         file = data.files[index],
        //         node = $(data.context.children()[index]);
        //     if (file.preview) {
        //         node
        //             .prepend('<br>')
        //             .prepend(file.preview);
        //     }
        //     if (file.error) {
        //         node
        //             .append('<br>')
        //             .append($('<span class="text-danger"/>').text(file.error));
        //     }
        //     if (index + 1 === data.files.length) {
        //         data.context.find('button')
        //             .text('Upload')
        //             .prop('disabled', !!data.files.error);
        //     }
        // }).on('fileuploadprogressall', function (e, data) {
        //     var progress = parseInt(data.loaded / data.total * 100, 10);
        //     $('#progress .progress-bar').css(
        //         'width',
        //         progress + '%'
        //     );
        // }).on('fileuploaddone', function (e, data) {
        //     $.each(data.result.files, function (index, file) {
        //         if (file.url) {
        //             var link = $('<a>')
        //                 .attr('target', '_blank')
        //                 .prop('href', file.url);
        //             $(data.context.children()[index])
        //                 .wrap(link);
        //         } else if (file.error) {
        //             var error = $('<span class="text-danger"/>').text(file.error);
        //             $(data.context.children()[index])
        //                 .append('<br>')
        //                 .append(error);
        //         }
        //     });
        // }).on('fileuploadfail', function (e, data) {
        //     $.each(data.files, function (index) {
        //         var error = $('<span class="text-danger"/>').text('File upload failed.');
        //         $(data.context.children()[index])
        //             .append('<br>')
        //             .append(error);
        //     });
        // }).prop('disabled', !$.support.fileInput)
        //     .parent().addClass($.support.fileInput ? undefined : 'disabled');
    },
    render: function () {
        return (React.DOM.span(null, 
            React.DOM.span({className: "btn btn-success fileinput-button"}, 
                React.DOM.i({className: "glyphicon glyphicon-plus"}), 
                React.DOM.span(null, "Add file"), 
                React.DOM.input({id: "fileupload", data: "blueimp-fileupload", ref: "fileupload", type: "file", name: "video"})
            ), 
            React.DOM.br(null), 
            React.DOM.br(null), 
            React.DOM.div({id: "progress", className: "progress"}, 
                React.DOM.div({className: "progress-bar progress-bar-success"})
            ), 
            React.DOM.div({id: "files", className: "files"})
        ));
    }
});