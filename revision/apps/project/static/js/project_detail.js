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
        return (React.DOM.div({className: "row"}, 
            React.DOM.h2(null, name, " ", React.DOM.small(null, "started: ", started)), 
            React.DOM.h4(null, "Version: ", React.DOM.small(null, versionNodes)), 
            React.DOM.h4(null, React.DOM.a({href: this.props.links.chronicle, className: "btn btn-primary pull-right"}, "Chronicle")), 
            React.DOM.br(null), 
            React.DOM.br(null)
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

        var handleSeek = (this.props.onSeekTo !== undefined) ? this.props.onSeekTo.bind(this, progress_seconds) : null ;

        if ( handleSeek !== null ) {
            return (React.DOM.span({className: classNames}, 
            handleSeek, 
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
        var commentTypeNodes = this.state.available_types.map(function ( type ) {
            return (React.DOM.li(null, 
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
            btnClassNameA += ' btn-primary';
            btnClassNameB += ' btn-primary';

        } else {
            btnClassNameA += ' btn-info';
            btnClassNameB += ' btn-info';
        }

        return (
            React.DOM.form({onSubmit: this.handleSubmitComment}, 
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
                    React.DOM.input({type: "text", ref: "comment", name: "comment", placeholder: "Add comment here...", className: "form-control input-lg"}), 
                    React.DOM.input({type: "hidden", ref: "comment_type", value: current_type}), 
                    React.DOM.span({className: "input-group-addon"}, Timestamp)

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
        var type_className = 'label label-warning';

        if ( comment_type === 'comment' ) {
            type_className = 'label label-success';

        } else if ( comment_type === 'sketch' ) {
            type_className = 'label label-info';

        }

        return (
            React.DOM.li({className: ""}, 
                
                React.DOM.div({className: "col-xs-2 pull-right"}, 
                    React.DOM.a({href: "javascript:;", onClick: this.handleDeleteComment.bind(this, comment.pk)}, React.DOM.span({className: "glyphicon glyphicon-remove-circle pull-right"})), 
                    React.DOM.br(null), timestamp, 
                    React.DOM.br(null), React.DOM.span({className: "pull-right"}, React.DOM.small(null, comment.date_of))
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
            return CommentItemView({onVideoUpdate: self.props.onVideoUpdate, 
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
        var video_subtitles_url = this.props.video.video_subtitles_url;
        return (
            React.DOM.div({className: "flowplayer"}, 
               React.DOM.video(null, 
                React.DOM.source({src: video_url, type: video_type}), 
                    React.DOM.track({src: video_subtitles_url})
               )
            )
        );
    }
});

// base view
var BaseProjectDetailView = React.createClass({displayName: 'BaseProjectDetailView',
    getInitialState: function () {
        return {
            'play': false,
            'video': Video,
            'project': Project,
            'links': Links,
            'current_type': 'Comment',
            'progress': 0,
            'flowplayer_selector': '.flowplayer'
        }
    },
    handleVideoUpdate: function ( video ) {
        this.setState({
            'video': video
        });
    },
    handleTypeChange: function ( event ) {
        this.setState({
            'current_type': event.target.text
        });
    },
    handleSeekTo: function ( seek_to, event ) {
        console.log(seek_to);
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
        var self = this;
        /**
        * Capture keyboard events
        **/
        Mousetrap.bind('space', function () {
            if ( self.state.play === true ) {
                flowplayer.pause();    
                self.setState({'play': false});
            } else {
                flowplayer.resume();
                self.setState({'play': true});
            }
            return false;
        });

        /**
        * local function to bind common functionality together for halting and focusing
        **/
        var commentTypeSetter = function ( type ) {
            flowplayer.pause();
            console.log(type)
            self.setState({
                'current_type': type,
                'play': false,
            });
            $('input[name=comment]').focus();
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

        var Title = TitleView({project: this.state.project, 
                               links: this.state.links})
        var FlowPlayer = FlowPlayerView({video: this.state.video})
        var CommentForm = CommentFormView({onVideoUpdate: this.handleVideoUpdate, 
                                           onSetCurrentType: this.handleTypeChange, 
                                           current_type: this.state.current_type, 
                                           progress: this.state.progress, 
                                           video: this.state.video})

        var CommentList = CommentListView({onVideoUpdate: this.handleVideoUpdate, 
                                           onSeekTo: this.handleSeekTo, 
                                           comments: this.state.video.comments})

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