/** @jsx React.DOM */
/**
* Project detail controls
*
*/
// title view
var TitleView = React.createClass({displayName: 'TitleView',
    render: function () {
        var name = this.props.project.name;
        var started = this.props.project.date_created;
        var versionNodes = this.props.project.versions.map(function ( version ) {
            return VersionView({version: version})
        });
        return (React.DOM.span(null, 
            React.DOM.h2(null, name, " ", React.DOM.small(null, "started: ", started)), 
            React.DOM.h4(null, "Version: ", React.DOM.small(null, versionNodes))
        ));
    }
});

// version indicator view
var VersionView = React.createClass({displayName: 'VersionView',
    render: function () {
        var is_current = this.props.version.is_current;
        var classNames = null;

        if ( is_current === true ) {
            classNames = 'label label-info'
        }

        return (React.DOM.span(null, 
                React.DOM.a({href: this.props.version.url}, React.DOM.span({className: classNames}, this.props.version.name))
            ));
    }
});

// 
var CollaboratorDetailView = React.createClass({displayName: 'CollaboratorDetailView',
    render: function () {
        var user_class = this.props.user_class
        var classNames = 'pull-right label';
        if ( user_class === 'owner' ) {
            classNames += ' label-primary';

        } else if (  user_class === 'colleague'  ) {
            classNames += ' label-info';

        } else {
            classNames += ' label-success';

        }
        return (
            React.DOM.li({className: "list-group-item"}, 
            React.DOM.span({className: "glyphicon glyphicon-comment"}), " ", this.props.name, ":", 
            React.DOM.span({className: classNames}, user_class)
            )
        );
    }
});


var CollaboratorView = React.createClass({displayName: 'CollaboratorView',
    render: function () {
        var name = this.props.name;
        return (
            React.DOM.span(null, 
            React.DOM.span({className: "glyphicon glyphicon-comment"}), " ", name, ":"
            )
        )
    }
});


var CollaboratorListView = React.createClass({displayName: 'CollaboratorListView',
    getInitialState: function () {
        return {
            'project': Project,
        }
    },
    render: function () {
        var collaboratorNodes = this.state.project.collaborators.map(function ( person ) {
            return CollaboratorDetailView({name: person.name, user_class: person.user_class})
        });

        return (
            React.DOM.span(null, 
              React.DOM.h2(null, "Collaborators"), 
              React.DOM.p(null, "Add new collaborators here"), 
              React.DOM.ul({className: "list-group"}, 
                collaboratorNodes
              )
            )
        );
    }
});

// time indicator view - used as a display element in a number of other views
var TimestampView = React.createClass({displayName: 'TimestampView',
    render: function () {
        var is_link = this.props.is_link || true;
        var timestamp = this.props.timestamp;
        var timestamp_link = 't-' + timestamp;
        var classNames = 'badge pull-right';

        if ( is_link === true ) {
            return (React.DOM.span({className: classNames}, 
                React.DOM.a({href: timestamp_link}, timestamp)
                ));
        } else {
            return (React.DOM.span({className: classNames}, 
                timestamp
                ));
        }
    }
});

// new comment form view
var CommentFormView = React.createClass({displayName: 'CommentFormView',
    render: function () {
        var is_link = false;
        var Timestamp = TimestampView({is_link: is_link, timestamp: this.props.progress})
        return (
            React.DOM.form(null, 
                React.DOM.div({className: "input-group"}, 
                    React.DOM.span({className: "input-group-addon"}, 
                        React.DOM.div({className: "control-type-selector btn-group"}, 
                          React.DOM.button({type: "button", className: "btn btn-success"}, "Comment"), 
                          React.DOM.button({type: "button", className: "btn btn-success dropdown-toggle", 'data-toggle': "dropdown"}, 
                            React.DOM.span({className: "caret"}), 
                            React.DOM.span({className: "sr-only"}, "Toggle Dropdown")
                          ), 
                          React.DOM.ul({className: "dropdown-menu", role: "menu"}, 
                            React.DOM.li(null, React.DOM.a({href: "#"}, "Comment")), 
                            React.DOM.li(null, React.DOM.a({href: "#"}, "Subtitle")), 
                            React.DOM.li(null, React.DOM.a({href: "#"}, "Sketch"))
                          )
                        )
                    ), 

                  React.DOM.input({type: "text", name: "comment", placeholder: "Add comment here...", className: "form-control input-lg"}), 

                  React.DOM.span({className: "input-group-addon"}, Timestamp)

                )
            )
        );
    }
});

var CommentItemView = React.createClass({displayName: 'CommentItemView',
    render: function () {
        var comment = this.props.comment;
        var comment_type = comment.type;
        var collaborator = CollaboratorView({name: comment.comment_by})
        var timestamp = TimestampView({timestamp: comment.timestamp})
        var type_className = 'label label-warning';

        if ( comment_type === 'comment' ) {
            type_className = 'label label-info';

        } else if ( comment_type === 'sketch' ) {
            type_className = 'label label-primary';

        }

        return (
            React.DOM.div({className: "list-group-item"}, 
                
                React.DOM.div({className: "col-xs-2 pull-right"}, 
                    React.DOM.a({href: "#delete"}, React.DOM.span({className: "glyphicon glyphicon-remove-circle pull-right"})), 
                    React.DOM.br(null), timestamp, 
                    React.DOM.br(null), React.DOM.span({className: "pull-right"}, React.DOM.small(null, comment.date_of))
                ), 

                React.DOM.span({className: type_className}, comment.type), 

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
        commentNodes = this.props.comments.map(function (comment) {
            return CommentItemView({comment: comment})
        });

        return (React.DOM.span(null, 
        React.DOM.div({className: "list-group"}, 
            commentNodes
        )
        ));
    }
});

// new version view
// comment list view
var NewVersionView = React.createClass({displayName: 'NewVersionView',
    render: function () {
        return (React.DOM.span(null));
    }
});

// collaborators view
// comment list view
var CollaboratorsView = React.createClass({displayName: 'CollaboratorsView',
    render: function () {
        return (React.DOM.span(null));
    }
});

// save/export view

// flowplayer
var FlowPlayerView = React.createClass({displayName: 'FlowPlayerView',
    render: function () {
        var video_url = this.props.video.url;
        var video_type = this.props.video.type;
        return (
            React.DOM.div({className: "flowplayer"}, 
               React.DOM.video(null, 
                React.DOM.source({src: video_url, type: video_type})
               )
            )
        );
    }
});

// base view
var BaseProjectDetailView = React.createClass({displayName: 'BaseProjectDetailView',
    getInitialState: function () {
        return {
            'video': Video,
            'project': Project,
            'progress': '00:00:00',
            'flowplayer_selector': '.flowplayer'
        }
    },
    componentDidMount: function () {
        var self = this;
        /**
        * Flowplayer setup and configuration
        **/
        flowplayer(function ( api, root ) {
            //
            // Capture Events
            //
            api.bind("progress", function ( event, ob, progress ) {
                self.state.video.timestamp = progress;
                self.setState({
                    'progress': progress
                });
            });

        });

        /**
        * Capture keyboard events
        **/
        Mousetrap.bind('s', function () {
            flowplayer().pause();
        });
        Mousetrap.bind('p', function () {
            flowplayer().resume();
        });
        Mousetrap.bind('1', function () {
            flowplayer().seekTo(1);
        });
        Mousetrap.bind('0', function () {
            flowplayer().seekTo(0);
        });


    },
    render: function () {

        var Title = TitleView({project: this.state.project})
        var FlowPlayer = FlowPlayerView({video: this.state.video})
        var CommentForm = CommentFormView({progress: this.state.progress, video: this.state.video})
        var CommentList = CommentListView({comments: this.state.project.comments})

        return (React.DOM.span(null, 
            React.DOM.div({className: "jumbotron"}, 
                React.DOM.div({className: "container"}, 
                    Title, 
                    FlowPlayer, 
                    React.DOM.div({className: "row"}, 
                        CommentForm
                    )
                )
            ), 
            React.DOM.div({className: "container"}, 
                React.DOM.div({className: "row"}, 
                    CommentList
                )
            )
        ));
    }
});


// render the Base set
React.renderComponent(
  BaseProjectDetailView(null),
  document.getElementById('project-detail-base')
);

// render the collaborators
React.renderComponent(
  CollaboratorListView(null),
  document.getElementById('project-detail-collaborators')
);