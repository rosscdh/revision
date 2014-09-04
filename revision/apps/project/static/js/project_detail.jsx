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
        return (<span>
            <h2>{name} <small>started: {started}</small></h2>
            <h4>Version: <small>{versionNodes}</small></h4>
        </span>);
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
//console.log(this.props.onSeekTo)
        var handleSeek = (this.props.onSeekTo !== undefined) ? this.props.onSeekTo.bind(this, progress_seconds) : null ;

        if ( handleSeek !== null ) {
            return (<span className={classNames}>
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
    render: function () {
        var self = this;
        var is_link = false;
        var Timestamp = <TimestampView is_link={is_link} progress={this.props.progress} />

        var current_type = this.props.current_type;

        var commentTypeNodes = this.state.available_types.map(function ( type ) {
            return (<li>
                <a href="javascript:;" onClick={self.props.onSetCurrentType}>{type}</a>
            </li>);
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
            <form>
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

                    <input type="text" name="comment" placeholder="Add comment here..." className="form-control input-lg" />
                    <span className="input-group-addon">{Timestamp}</span>

                </div>
            </form>
        );
    }
});

var CommentItemView = React.createClass({
    render: function () {
        var comment = this.props.comment;
        var comment_type = comment.type;
        var collaborator = <CollaboratorView name={comment.comment_by} />
        var timestamp = <TimestampView onSeekTo={this.props.onSeekTo} progress={comment.progress}/>
        var type_className = 'label label-warning';

        if ( comment_type === 'comment' ) {
            type_className = 'label label-info';

        } else if ( comment_type === 'sketch' ) {
            type_className = 'label label-primary';

        }

        return (
            <li className="">
                
                <div className="col-xs-2 pull-right">
                    <a href="#delete"><span className="glyphicon glyphicon-remove-circle pull-right"></span></a>
                    <br/>{timestamp}
                    <br/><span className="pull-right"><small>{comment.date_of}</small></span>
                </div>

                <span className={type_className}>{comment.type}</span>

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
            return <CommentItemView onSeekTo={self.props.onSeekTo} comment={comment} />
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
        var video_url = this.props.video.url;
        var video_type = this.props.video.type;
        return (
            <div className="flowplayer">
               <video>
                <source src={video_url} type={video_type} />
               </video>
            </div>
        );
    }
});

// base view
var BaseProjectDetailView = React.createClass({
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

        var Title = <TitleView project={this.state.project} />
        var FlowPlayer = <FlowPlayerView video={this.state.video} />
        var CommentForm = <CommentFormView onSetCurrentType={this.handleTypeChange} current_type={this.state.current_type} progress={this.state.progress} video={this.state.video} />
        var CommentList = <CommentListView onSeekTo={this.handleSeekTo} comments={this.state.project.comments} />

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