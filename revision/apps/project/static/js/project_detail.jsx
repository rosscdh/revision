/** @jsx React.DOM */
/**
* Project detail controls
*
*/
// title view
var TitleView = React.createClass({
    render: function () {
        var name = this.props.project.name;
        var started = this.props.project.date_created;
        var versionNodes = this.props.project.versions.map(function ( version ) {
            return <VersionView version={version} />
        });
        return (<div className="row">
            <h2>{name} <small>started: {started}</small></h2>
            <h4>Version: <small>{versionNodes}</small></h4>
            <h4><a href={this.props.links.chronicle} className="btn btn-primary pull-right">Chronicle</a></h4>
            <br/>
            <br/>
        </div>);
    }
});

// version indicator view
var VersionView = React.createClass({
    render: function () {
        var is_current = this.props.version.is_current;
        var classNames = null;

        if ( is_current === true ) {
            classNames = 'label label-info'
        }

        return (<span>
                <a href={this.props.version.url}><span className={classNames}>{this.props.version.name}</span></a>
            </span>);
    }
});

// 
var CollaboratorDetailView = React.createClass({
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
            <li className="list-group-item">
            <span className="glyphicon glyphicon-comment"></span> {this.props.name}:
            <span className={classNames}>{user_class}</span>
            </li>
        );
    }
});


var CollaboratorView = React.createClass({
    render: function () {
        var name = this.props.name;
        return (
            <span>
            <span className="glyphicon glyphicon-comment"></span> {name}:
            </span>
        )
    }
});


var CollaboratorListView = React.createClass({
    getInitialState: function () {
        return {
            'project': Project,
        }
    },
    render: function () {
        var collaboratorNodes = this.state.project.collaborators.map(function ( person ) {
            return <CollaboratorDetailView name={person.name} user_class={person.user_class} />
        });

        return (
            <span>
              <h2>Collaborators</h2>
              <p>Add new collaborators here</p>
              <ul className="list-group">
                {collaboratorNodes}
              </ul>
            </span>
        );
    }
});

// time indicator view - used as a display element in a number of other views
var TimestampView = React.createClass({
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
            return (<span className={classNames}>
            {handleSeek}
                <a href={timestamp_link} onClick={handleSeek}>{stamp}</a>
                </span>);
        } else {
            return (<span className={classNames}>
                {stamp}
                </span>);
        }
    }
});


// Comment form
var CommentFormView = React.createClass({
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
            return (<li>
                <a href="javascript:;" onClick={self.props.onSetCurrentType}>{type}</a>
            </li>);
        });
        var Timestamp = <TimestampView is_link={is_link} progress={this.props.progress} />
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
            <form onSubmit={this.handleSubmitComment}>
                <div className="input-group">

                    <span className="input-group-addon">
                        <div className="control-type-selector btn-group">
                          <button type="button" className={btnClassNameA}>{current_type}</button>
                          <button type="button" className={btnClassNameB} data-toggle="dropdown">
                            <span className="caret"></span>
                            <span className="sr-only">Toggle Dropdown</span>
                          </button>
                          <ul className="dropdown-menu" role="menu">
                            {commentTypeNodes}
                          </ul>
                        </div>
                    </span>
                    <input type="text" ref="comment" name="comment" placeholder="Add comment here..." className="form-control input-lg" />
                    <input type="hidden" ref="comment_type" value={current_type} />
                    <span className="input-group-addon">{Timestamp}</span>

                </div>
            </form>
        );
    }
});

var CommentItemView = React.createClass({
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
        var collaborator = <CollaboratorView name={comment.comment_by} />
        var timestamp = <TimestampView onSeekTo={this.props.onSeekTo} progress={comment.progress}/>
        var type_className = 'label label-warning';

        if ( comment_type === 'comment' ) {
            type_className = 'label label-success';

        } else if ( comment_type === 'sketch' ) {
            type_className = 'label label-info';

        }

        return (
            <li className="">
                
                <div className="col-xs-2 pull-right">
                    <a href="javascript:;" onClick={this.handleDeleteComment.bind(this, comment.pk)}><span className="glyphicon glyphicon-remove-circle pull-right"></span></a>
                    <br/>{timestamp}
                    <br/><span className="pull-right"><small>{comment.date_of}</small></span>
                </div>

                <span className={type_className}>{comment_type}</span>

                <blockquote>
                    {collaborator}&nbsp;
                    {comment.comment}
                </blockquote>
                
            </li>
        )
    }
});

// comment list view
var CommentListView = React.createClass({
    render: function () {
        var self = this;
        commentNodes = this.props.comments.map(function (comment) {
            return <CommentItemView onVideoUpdate={self.props.onVideoUpdate}
                                    onSeekTo={self.props.onSeekTo}
                                    comment={comment} />
        });

        return (<span>
        <ul className="list-unstyled list-group">
            {commentNodes}
        </ul>
        </span>);
    }
});

// new version view
// comment list view
var NewVersionView = React.createClass({
    render: function () {
        return (<span/>);
    }
});

// collaborators view
// comment list view
var CollaboratorsView = React.createClass({
    render: function () {
        return (<span/>);
    }
});

// save/export view

// flowplayer
var FlowPlayerView = React.createClass({
    render: function () {
        var video_url = this.props.video.video_url;
        var video_type = this.props.video.type;
        var video_subtitles_url = this.props.video.video_subtitles_url;
        return (
            <div className="flowplayer">
               <video>
                <source src={video_url} type={video_type} />
                    <track src={video_subtitles_url} />
               </video>
            </div>
        );
    }
});

// base view
var BaseProjectDetailView = React.createClass({
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
                                           comments={this.state.video.comments} />

        return (<span>
            <div className="jumbotron">
                <div className="container">
                    {Title}
                    {FlowPlayer}
                    <div className="row">
                        {CommentForm}
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    {CommentList}
                </div>
            </div>
        </span>);
    }
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