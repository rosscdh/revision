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
var CollaboratorView = React.createClass({
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

var CollaboratorListView = React.createClass({
    getInitialState: function () {
        return {
            'project': Project,
        }
    },
    render: function () {
        var collaboratorNodes = this.state.project.collaborators.map(function ( person ) {
            return <CollaboratorView name={person.name} user_class={person.user_class} />
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
    render: function () {
        var is_link = this.props.is_link || true;
        var timestamp = this.props.timestamp;
        var timestamp_link = 't-' + timestamp;
        var classNames = 'badge pull-right';

        if ( is_link === true ) {
            return (<span className={classNames}>
                <a href={timestamp_link}>{timestamp}</a>
                </span>);
        } else {
            return (<span className={classNames}>
                {timestamp}
                </span>);
        }
    }
});

// new comment form view
var CommentFormView = React.createClass({
    render: function () {
        var is_link = false;
        var Timestamp = <TimestampView is_link={is_link} timestamp={this.props.progress} />
        return (
            <form>
                <div className="input-group">
                    <span className="input-group-addon">
                        <div className="control-type-selector btn-group">
                          <button type="button" className="btn btn-success">Comment</button>
                          <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
                            <span className="caret"></span>
                            <span className="sr-only">Toggle Dropdown</span>
                          </button>
                          <ul className="dropdown-menu" role="menu">
                            <li><a href="#">Comment</a></li>
                            <li><a href="#">Subtitle</a></li>
                            <li><a href="#">Sketch</a></li>
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
        var timestamp = <TimestampView timestamp={comment.timestamp}/>
        var type_className = 'label label-warning';

        if ( comment_type === 'comment' ) {
            type_className = 'label label-info';

        } else if ( comment_type === 'sketch' ) {
            type_className = 'label label-primary';

        }

        return (
            <div className="list-group-item">
                
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
                
            </div>
        )
    }
});

// comment list view
var CommentListView = React.createClass({
    render: function () {
        commentNodes = this.props.comments.map(function (comment) {
            return <CommentItemView comment={comment} />
        });

        return (<span>
        <div className="list-group">
            {commentNodes}
        </div>
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

        var Title = <TitleView project={this.state.project} />
        var FlowPlayer = <FlowPlayerView video={this.state.video} />
        var CommentForm = <CommentFormView progress={this.state.progress} video={this.state.video} />
        var CommentList = <CommentListView comments={this.state.project.comments} />

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