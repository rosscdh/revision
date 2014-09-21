/** @jsx React.DOM */
/**
* Shared Project Comments objects
*
*/
// collaborators view
// comment list view
var CollaboratorsView = React.createClass({
    render: function () {
        return (<span/>);
    }
});

// Comment form
var CommentFormView = React.createClass({
    getInitialState: function () {
        return {
            'comment': '',
            'available_types': ['Comment', 'Subtitle', 'Sketch']
        }
    },
    handleSubmitComment: function ( event ) {
        event.preventDefault();
        var self = this;

        var comment = this.refs.comment.getDOMNode().value.trim();
        var comment_type = this.refs.comment_type.getDOMNode().value.trim();
        var comment_by = User.initials;
        var progress = this.props.progress;

        CommentResource.create( comment, comment_type, comment_by, progress ).defer().done(function ( data ) {

            if ( data.status_text === undefined ) {
                VideoResource.detail().defer().done(function ( data ) {
                    self.setState({
                        'comment': ''
                    });
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
        var commentTypeNodes = this.state.available_types.map(function ( type, index ) {
            return (<li key={index}>
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
            btnClassNameA += ' btn-warning';
            btnClassNameB += ' btn-warning';

        } else {
            btnClassNameA += ' btn-info';
            btnClassNameB += ' btn-info';
        }

        return (
            <form onSubmit={this.handleSubmitComment} className="text-center">
                {Timestamp}

                <div className="input-group">
                    <span className="input-group-addon">
                        <div className="control-type-selector btn-group">
                          <button type="button" className={btnClassNameA}>{this.props.current_type}</button>
                          <button type="button" className={btnClassNameB} data-toggle="dropdown">
                            <span className="caret"></span>
                            <span className="sr-only">Toggle Dropdown</span>
                          </button>
                          <ul className="dropdown-menu" role="menu">
                            {commentTypeNodes}
                          </ul>
                        </div>
                    </span>
                    <textarea ref="comment" name="comment" placeholder="Add comment here..." className="form-control input-lg" defaultValue={this.state.comment} />
                    <input type="hidden" ref="comment_type" value={current_type} />
                    <span className="input-group-addon"><input className="btn btn-primary" type="submit" value="send" /></span>
                </div>
            </form>
        );
    }
});

var SubtitleForm = React.createClass({
    handleSubmit: function ( event ) {
        event.preventDefault();
        var self = this;

        CommentResource.edit().defer().done(function ( data ) {

        });
        return false;
    },
    render: function () {
        return (<form onSubmit={this.handleSubmit} data-parsley-validate>
            <div className="input-group">
                <label htmlFor="">Show for:</label>
                <input type="input" ref="secs" name="secs" value="3" data-parsley-length="[1, 5]" data-parsley-group="subtitle" data-parsley-required="true" data-parsley-type="integer" type="number" />
                <span class="input-group-addon">secs</span>
            </div>
        </form>);
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
        var date_of = moment(comment.date_of).fromNow();
        var type_className = 'label label-warning';
        var form = null;

        if ( comment_type === 'comment' ) {
            type_className = 'label label-success';

        } else if ( comment_type === 'sketch' ) {
            type_className = 'label label-info';

        } else {
            // subtitle
            form = <SubtitleForm comment={comment} />
        }

        return (
            <li key={comment.uuid} className="">
                
                <div className="col-xs-2 pull-right">
                    <a href="javascript:;" onClick={this.handleDeleteComment.bind( this, comment.pk )}><span className="glyphicon glyphicon-remove-circle pull-right"></span></a>
                    <br/><span className="pull-right">{timestamp}</span>
                    <br/><span className="pull-right"><small>{date_of}</small></span>
                </div>

                <span className={type_className}>{comment_type}</span>

                <blockquote>
                    {collaborator}&nbsp;
                    {comment.comment}
                </blockquote>
                {form}
            </li>
        )
    }
});

// comment list view
var CommentListView = React.createClass({
    render: function () {
        var self = this;
        commentNodes = this.props.comments.map(function (comment) {
            return <CommentItemView key={comment.pk}
                                    onVideoUpdate={self.props.onVideoUpdate}
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
