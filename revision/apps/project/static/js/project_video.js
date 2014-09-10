/** @jsx React.DOM */
'use strict';
/**
* Video controls
*
*/
var VideoFormModal = React.createClass({displayName: 'VideoFormModal',
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
        React.DOM.div({id: "modal-new-video", className: "modal fade bs-example-modal-lg", tabIndex: "-1", role: "dialog", 'aria-labelledby': "modal-new-video-help", 'aria-hidden': "true"}, 
          React.DOM.div({className: "modal-dialog modal-lg"}, 
            React.DOM.div({className: "modal-content"}, 
                React.DOM.div({className: "modal-header"}, 
                    React.DOM.button({type: "button", className: "close", 'data-dismiss': "modal"}, React.DOM.span({'aria-hidden': "true"}, "×"), React.DOM.span({className: "sr-only"}, "Close")), 
                    React.DOM.h4({className: "modal-title", id: "myModalLabel"}, "New Version")
                ), 
                React.DOM.div({className: "modal-body"}, 
                    React.DOM.div({className: "row"}, 
                        React.DOM.form({onSubmit: this.onSubmitForm}, 
                            React.DOM.label(null, "Name:"), React.DOM.input({ref: "name", maxLength: "255", name: "name", type: "text"}), 
                            React.DOM.label(null, "Video url:"), React.DOM.input({ref: "video_url", maxLength: "200", name: "video_url", type: "url"}), 
                            React.DOM.input({type: "submit", value: "Create"})
                        )
                    )
                )
            )
          )
        )
        );
    }
});

var CreateVideoView = React.createClass({displayName: 'CreateVideoView',
    render: function () {
        return (React.DOM.span(null, 
            React.DOM.a({href: "#", className: "btn btn-success", 'data-toggle': "modal", 'data-target': "#modal-new-video"}, "New Video")
        ));
    }
});
