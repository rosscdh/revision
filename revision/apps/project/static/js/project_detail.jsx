/** @jsx React.DOM */
'use strict';
/**
* Project detail controls
*
*/
// title view
var TitleView = React.createClass({
    render: function () {
        var name = this.props.project.name;
        var started = moment(this.props.project.date_created).format('LLL');;
        if ( this.props.project.versions.length === 0 ) {
            return (<span>
                &nbsp;
            </span>);
        } else {
            var num_versions = this.props.project.versions.length;
            var versionNodes = this.props.project.versions.map(function ( version, index ) {
                // set the v object
                version.ver = 'v{version}'.assign({'version': num_versions - index});
                return <VersionView key={index} version={version} />
            });
            return (<div className="row">
                <h2>{name} <small>:{started}</small></h2>
                <h4>Version: <small>{versionNodes}</small></h4>
            </div>);
        }
    }
});

// version indicator view
var VersionView = React.createClass({
    render: function () {
        var is_current = this.props.version.slug == Video.slug;
        var classNames = null;

        if ( is_current === true ) {
            classNames = 'label label-info'
        }

        return (<ul className="versions list-unstyled">
                <li><a href={this.props.version.url}><span className={classNames}>{this.props.version.name} ({this.props.version.ver})</span></a></li>
            </ul>);
    }
});

// new version view
// comment list view
var NewVersionView = React.createClass({
    render: function () {
        return (<span/>);
    }
});

// base view
var BaseProjectDetailView = React.createClass({
    getInitialState: function () {
        return {
            'play': false,
            'links': Links || [],
            'video': Video || {},
            'project': Project || {},
            'comments': Video.comments || [],
            'current_type': 'Comment',
            'messages': [],
            'progress': 0,
            'flowplayer': null,
        }
    },
    handleVideoUpdate: function ( video ) {
        this.setState({
            'video': video,
            'comments': video.comments || [],
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
            api.conf.debug = false;
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
    renderNoVideoUploaderPad: function () {
        var VideoUploader = <VideoUploaderView onMessage={this.onMessage}
                                               uploader_config={UploaderConfig}
                                               project={this.state.project} />
        return (<div className="jumbotron">
                <div className="container">
                    <h2>Upload first video<br/><small>Please provide the first video for this project</small></h2>
                    {VideoUploader}
                </div>
            </div>);
    },
    onMessage: function ( messages ) {
        var self = this;
        this.setState({
            'messages': messages,
        });
        // reset messages after a time period
        // $.delay( 5200, function ( a ) {
        //     $('.messages').fadeOut( 'slow' );
        // });
    },
    renderVideoPlayer: function () {
        var messagesView = <Messages messages={this.state.messages} />

        var createVideoView = <CreateVideoView onMessage={this.onMessage} project={this.state.project} />

        var Title = <TitleView project={this.state.project}
                               links={this.state.links} />

        var FlowPlayer = <FlowPlayerView video={this.state.video} />
        var CommentForm = <CommentFormView onVideoUpdate={this.handleVideoUpdate}
                                           onSetCurrentType={this.handleTypeChange}
                                           current_type={this.state.current_type}
                                           progress={this.state.progress}
                                           video={this.state.video} />

        var CommentList = <CommentListView onVideoUpdate={this.handleVideoUpdate}
                                           onSeekTo={this.handleSeekTo}
                                           comments={this.state.comments} />

        return (<span>
            <div className="jumbotron">
                <div className="container">
                    {Title}
                    {createVideoView}
                    {messagesView}
                    <div className="row">
                        <div className="col-xs-8">
                        {FlowPlayer}
                        {CommentForm}
                        </div>
                        <div className="col-xs-4 comment-list">
                            {CommentList}
                        </div>
                    </div>
                </div>
            </div>
        </span>);
    },
    render: function () {
        if ( this.state.project.versions.length > 0 ) {
            return this.renderVideoPlayer();
        } else {
            return this.renderNoVideoUploaderPad();
        }
    },
});


// render the Base set
React.renderComponent(
  <BaseProjectDetailView />,
  document.getElementById('project-detail-base')
);

// render the collaborators
React.renderComponent(
  <CollaboratorListView />,
  document.getElementById('project-detail-collaborators')
);