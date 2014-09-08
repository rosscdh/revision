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