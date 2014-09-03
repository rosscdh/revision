/** @jsx React.DOM */
/**
* Project detail controls
*
*/
// title view
var TitleView = React.createClass({
    render: function () {
        return (<span/>);
    }
});

// version indicator view
var VersionView = React.createClass({
    render: function () {
        return (<span/>);
    }
});

// 
var CollaboratorView = React.createClass({
    render: function () {
        var name = this.props.name;
        return (
            <span className="glyphicon glyphicon-comment"></span> {name}:
        )
    }
});

// time indicator view - used as a display element in a number of other views
var TimestampView = React.createClass({
    getInitialState: function() {
        return {
            'timestamp': '00:00:00',
        }
    },
    render: function () {

        var timestamp = this.state.timestamp;
        var timestamp_link = 't-' + this.state.timestamp;
        var classNames = 'badge pull-right';

        return (<span className=classNames>
            <a href={timestamp_link}>{timestamp}</a>
            </span>);
    }
});

// new comment form view
var CommentFormView = React.createClass({
    render: function () {
        return (<span/>);
    }
});

var CommentItemView = React.createClass({
    render: function () {
        var comment = this.props.comment;
        var collaborator = <CollaboratorView name={comment.by} />
        var timestamp = <TimestampView timestamp={comment.date_of}/>
        return (
            <li className="list-group-item">
                <div className="col-xs-1">
                    <span className="label label-warning">{comment.type}</span>
                </div>
                {collaborator}
                {comment.body}
                <span className="glyphicon glyphicon-remove-circle pull-right"></span>
                {timestamp}
            </li>
        )
    }
});

// comment list view
var CommentListView = React.createClass({

    render: function () {
        commentNodes = this.state.comments.map(function (comment) {
            return <CommentItemView comment={comment} />
        });

        return (<span>
        <ul className="list-group">
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


// base view
var BaseProjectDetailView = React.createClass({
    render: function () {
        return (
            <div className="jumbotron">
              <div className="container">
                    <h2>My Cool Project <small>started: 3 days ago</small></h2>
                    <h4>Version: <small>
                        <a href="">1</a>
                        <a href="">2</a>
                        <a href=""><span className="label label-info">3</span></a>
                    </small></h4>
                    <div className="flowplayer">
                       <video>
                        <source src="{{ STATIC_URL }}HOTELENERGIEBALLMOTERSCHADE.mp4" type="video/mp4" />

                       </video>
                    </div>

                    <div className="row">
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

                              <input type="text" name="comment" placeholder="Add comment here..." className="form-control input-lg">

                              <span className="input-group-addon"><span className="badge"><a href="#t-05:15:23">05:15:23</a></span></span>
                            </div>
                        </form>
                    </div>

              </div>
            </div>
        );
    }
});


// render the set
React.renderComponent(
  <BaseProjectDetailView />,
  document.getElementById('project-detail-base')
);