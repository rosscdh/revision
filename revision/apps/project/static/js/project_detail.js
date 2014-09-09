/** @jsx React.DOM */
/**
* Project detail controls
*
*/
// title view
var TitleView = React.createClass({displayName: 'TitleView',
    render: function () {
        var createVideoView = CreateVideoView(null)
        var name = this.props.project.name;
        var started = this.props.project.date_created;
        var versionNodes = this.props.project.versions.map(function ( version, index ) {
            return VersionView({key: index, version: version})
        });
        return (React.DOM.div({className: "row"}, 
            createVideoView, 
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
            'flowplayer': null,
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
        this.state.flowplayer.seek( seek_to );
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
            api.conf.debug = true;
            api.conf.engine = 'html5';
            api.conf.preload = 'auto';
            api.conf.keyboard = false;
            //api.conf.rtmp = 'rtmp://127.0.0.1:8080';

            api.bind("progress", function ( event, ob, progress ) {
                self.state.video.timestamp = progress;
                self.setState({
                    'progress': progress
                });
            });
            api.bind("seek", function ( event, ob, progress ) {
                console.log(event)
                console.log(ob)
                console.log(progress)
            });
            
            // set the state handler
            self.setState({
                'flowplayer': api
            });
            // setup keyboard shortcuts
            self.setKeyboard( api );

        });

        // handle the new video event
        $(document).on("newVideo", function ( event ) {
            //console.log(event.video)
            self.handleVideoUpdate( event.video );
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

        var comments = this.state.video.comments;
        var CommentList = CommentListView({onVideoUpdate: this.handleVideoUpdate, 
                                           onSeekTo: this.handleSeekTo, 
                                           comments: comments})

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