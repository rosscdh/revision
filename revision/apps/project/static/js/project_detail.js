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
    secondsToStamp: function ( secs ) {
        var minutes = Math.floor(secs / 60);
        var seconds = (secs - minutes * 60).round(2);
        var hours = Math.floor(secs / 3600);
        //time = time - hours * 3600;
        return '{hours}:{minutes}:{seconds}'.assign({ 'seconds': seconds.pad(2), 'minutes': minutes.pad(2), 'hours': hours.pad(2) })
    },
    render: function () {
        var is_link = this.props.is_link || true;
        var progress_seconds = this.props.progress;
        var stamp = this.secondsToStamp( progress_seconds );
        var timestamp_link = '#' + stamp;
        var classNames = 'badge pull-right';
//console.log(this.props.onSeekTo)
        var handleSeek = (this.props.onSeekTo !== undefined) ? this.props.onSeekTo.bind(this, progress_seconds) : null ;

        if ( handleSeek !== null ) {
            return (React.DOM.span({className: classNames}, 
                React.DOM.a({href: timestamp_link, onClick: handleSeek}, stamp)
                ));
        } else {
            return (React.DOM.span({className: classNames}, 
                stamp
                ));
        }
    }
});


// Comment form
var CommentFormView = React.createClass({displayName: 'CommentFormView',
    getInitialState: function () {
        return {
            'available_types': ['Comment', 'Subtitle', 'Sketch']
        }
    },
    render: function () {
        var self = this;
        var is_link = false;
        var Timestamp = TimestampView({is_link: is_link, progress: this.props.progress})

        var current_type = this.props.current_type;

        var commentTypeNodes = this.state.available_types.map(function ( type ) {
            return (React.DOM.li(null, 
                React.DOM.a({href: "javascript:;", onClick: self.props.onSetCurrentType}, type)
            ));
        });

        // be more clver with this turn into an array and then push and join at end
        var btnClassNameA = 'btn';
        var btnClassNameB = 'btn dropdown-toggle';

        if ( current_type == 'Comment' ) {
            btnClassNameA += ' btn-success';
            btnClassNameB += ' btn-success';

        } else if ( current_type == 'Subtitle' ) {    
            btnClassNameA += ' btn-primary';
            btnClassNameB += ' btn-primary';

        } else {
            btnClassNameA += ' btn-info';
            btnClassNameB += ' btn-info';
        }

        return (
            React.DOM.form(null, 
                React.DOM.div({className: "input-group"}, 

                    React.DOM.span({className: "input-group-addon"}, 
                        React.DOM.div({className: "control-type-selector btn-group"}, 
                          React.DOM.button({type: "button", className: btnClassNameA}, current_type), 
                          React.DOM.button({type: "button", className: btnClassNameB, 'data-toggle': "dropdown"}, 
                            React.DOM.span({className: "caret"}), 
                            React.DOM.span({className: "sr-only"}, "Toggle Dropdown")
                          ), 
                          React.DOM.ul({className: "dropdown-menu", role: "menu"}, 
                            commentTypeNodes
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
        var timestamp = TimestampView({onSeekTo: this.props.onSeekTo, progress: comment.progress})
        var type_className = 'label label-warning';

        if ( comment_type === 'comment' ) {
            type_className = 'label label-info';

        } else if ( comment_type === 'sketch' ) {
            type_className = 'label label-primary';

        }

        return (
            React.DOM.li({className: ""}, 
                
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
        var self = this;
        commentNodes = this.props.comments.map(function (comment) {
            return CommentItemView({onSeekTo: self.props.onSeekTo, comment: comment})
        });

        return (React.DOM.span(null, 
        React.DOM.ul({className: "list-unstyled list-group"}, 
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
        var video_url = this.props.video.video_url;
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
            'current_type': 'Comment',
            'progress': 0,
            'flowplayer_selector': '.flowplayer'
        }
    },
    handleTypeChange: function ( event ) {
        this.setState({
            'current_type': event.target.text
        });
    },
    handleSeekTo: function ( seek_to, event ) {
        flowplayer().seek(seek_to);
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
            api.conf.keyboard = false;
            api.conf.preload = 'metadata';

            api.bind("progress", function ( event, ob, progress ) {
                self.state.video.timestamp = progress;
                self.setState({
                    'progress': progress
                });
            });
            // setup keyboard shortcuts
            self.setKeyboard( api );

        });
    },
    setKeyboard: function ( flowplayer ) {
            /**
            * Capture keyboard events
            **/
            Mousetrap.bind('s', function () {
                flowplayer.pause();
            });
            Mousetrap.bind('p', function () {
                flowplayer.resume();
            });
            Mousetrap.bind('1', function () {
                flowplayer.seekTo(1);
            });
            Mousetrap.bind('0', function () {
                flowplayer.seekTo(0);
            });


            /**
            * local function to bind common functionality together for halting and focusing
            **/
            var commentTypeSetter = function ( type ) {
                flowplayer().pause();
                $('input[name=comment]').focus();
                self.setState({
                    'current_type': type
                });
            };

            Mousetrap.bind('c', function () {
                // make comment type
                commentTypeSetter('Comment');
                return false; // dont output the text
            });
            Mousetrap.bind('k', function () {
               // make sketch type 
               commentTypeSetter('Sketch');
                return false; // dont output the text
            });
            Mousetrap.bind('t', function () {
               // make subtitle type 
                commentTypeSetter('Subtitle');
                return false; // dont output the text
            });


            Mousetrap.bind('?', function () {
                $('#modal-keyboard-help').modal('toggle');
                return false; // dont output the text
            });


    },
    render: function () {

        var Title = TitleView({project: this.state.project})
        var FlowPlayer = FlowPlayerView({video: this.state.video})
        var CommentForm = CommentFormView({onSetCurrentType: this.handleTypeChange, current_type: this.state.current_type, progress: this.state.progress, video: this.state.video})
        var CommentList = CommentListView({onSeekTo: this.handleSeekTo, comments: this.state.video.comments})

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