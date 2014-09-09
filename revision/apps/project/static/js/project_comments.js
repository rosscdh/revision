/** @jsx React.DOM */
/**
* Shared Project Comments objects
*
*/
// collaborators view
// comment list view
var CollaboratorsView = React.createClass({displayName: 'CollaboratorsView',
    render: function () {
        return (React.DOM.span(null));
    }
});

// Comment form
var CommentFormView = React.createClass({displayName: 'CommentFormView',
    getInitialState: function () {
        return {
            'comment': '',
            'available_types': ['Comment', 'Subtitle', 'Sketch']
        }
    },
    handleSubmitComment: function ( event ) {
        event.preventDefault();
        var self = this;

        var comment = this.refs.comment.getDOMNode().value.trim();
        var comment_type = this.refs.comment_type.getDOMNode().value.trim();
        var comment_by = 'RC';
        var progress = this.props.progress;

        CommentResource.create( comment, comment_type, comment_by, progress ).defer().done(function ( data ) {

            if ( data.status_text === undefined ) {
                VideoResource.detail().defer().done(function ( data ) {
                    self.setState({
                        'comment': ''
                    });
                    self.props.onVideoUpdate( data );
                });
            }

        });
        return false;
    },
    render: function () {
        var self = this;
        var is_link = false;
        var current_type = this.props.current_type.toLowerCase();
        var commentTypeNodes = this.state.available_types.map(function ( type, index ) {
            return (React.DOM.li({key: index}, 
                React.DOM.a({href: "javascript:;", onClick: self.props.onSetCurrentType}, type)
            ));
        });
        var Timestamp = TimestampView({is_link: is_link, progress: this.props.progress})
        // be more clver with this turn into an array and then push and join at end
        var btnClassNameA = 'btn';
        var btnClassNameB = 'btn dropdown-toggle';

        if ( current_type == 'comment' ) {
            btnClassNameA += ' btn-success';
            btnClassNameB += ' btn-success';

        } else if ( current_type == 'subtitle' ) {    
            btnClassNameA += ' btn-warning';
            btnClassNameB += ' btn-warning';

        } else {
            btnClassNameA += ' btn-info';
            btnClassNameB += ' btn-info';
        }

        return (
            React.DOM.form({onSubmit: this.handleSubmitComment, className: "text-center"}, 
                Timestamp, 

                React.DOM.div({className: "input-group"}, 
                    React.DOM.span({className: "input-group-addon"}, 
                        React.DOM.div({className: "control-type-selector btn-group"}, 
                          React.DOM.button({type: "button", className: btnClassNameA}, this.props.current_type), 
                          React.DOM.button({type: "button", className: btnClassNameB, 'data-toggle': "dropdown"}, 
                            React.DOM.span({className: "caret"}), 
                            React.DOM.span({className: "sr-only"}, "Toggle Dropdown")
                          ), 
                          React.DOM.ul({className: "dropdown-menu", role: "menu"}, 
                            commentTypeNodes
                          )
                        )
                    ), 
                    React.DOM.textarea({ref: "comment", name: "comment", placeholder: "Add comment here...", className: "form-control input-lg", defaultValue: this.state.comment}), 
                    React.DOM.input({type: "hidden", ref: "comment_type", value: current_type}), 
                    React.DOM.span({className: "input-group-addon"}, React.DOM.input({className: "btn btn-primary", type: "submit", value: "send"}))
                )
            )
        );
    }
});

var CommentItemView = React.createClass({displayName: 'CommentItemView',
    handleDeleteComment: function ( pk, event ) {
        var self = this;

        CommentResource.destroy( pk ).defer().done(function ( data ) {

            if ( data.status_text === undefined ) {
                VideoResource.detail().defer().done(function ( data ) {
                    self.props.onVideoUpdate( data );
                });
            }

        });
    },
    render: function () {
        var comment = this.props.comment;
        var comment_type = comment.comment_type.toLowerCase();
        var collaborator = CollaboratorView({name: comment.comment_by})
        var timestamp = TimestampView({onSeekTo: this.props.onSeekTo, progress: comment.progress})
        var date_of = moment(comment.date_of).fromNow();
        var type_className = 'label label-warning';

        if ( comment_type === 'comment' ) {
            type_className = 'label label-success';

        } else if ( comment_type === 'sketch' ) {
            type_className = 'label label-info';

        }

        return (
            React.DOM.li({key: comment.uuid, className: ""}, 
                
                React.DOM.div({className: "col-xs-2 pull-right"}, 
                    React.DOM.a({href: "javascript:;", onClick: this.handleDeleteComment.bind( this, comment.pk)}, React.DOM.span({className: "glyphicon glyphicon-remove-circle pull-right"})), 
                    React.DOM.br(null), React.DOM.span({className: "pull-right"}, timestamp), 
                    React.DOM.br(null), React.DOM.span({className: "pull-right"}, React.DOM.small(null, date_of))
                ), 

                React.DOM.span({className: type_className}, comment_type), 

                React.DOM.blockquote(null, 
                    collaborator, " ", 
                    comment.comment
                )
                
            )
        )
    }
});

// comment list view
var CommentListView = React.createClass({displayName: 'CommentListView',
    render: function () {
        var self = this;
        commentNodes = this.props.comments.map(function (comment) {
            return CommentItemView({key: comment.pk, 
                                    onVideoUpdate: self.props.onVideoUpdate, 
                                    onSeekTo: self.props.onSeekTo, 
                                    comment: comment})
        });

        return (React.DOM.span(null, 
        React.DOM.ul({className: "list-unstyled list-group"}, 
            commentNodes
        )
        ));
    }
});
