/** @jsx React.DOM */
/**
* Project chronicle controls
*
*/
var ChronicleVideoBase = React.createClass({displayName: 'ChronicleVideoBase',
    getInitialState: function () {
        return {
            'video': Video
        }
    },
    render: function () {
        var FlowPlayer = FlowPlayerView({video: this.state.video})
        return (React.DOM.span(null, 
            FlowPlayer
        ));
    }
});
// render chronicle
React.renderComponent(
  ChronicleVideoBase(null),
  document.getElementById('project-detail-video')
);


var ChronicleCommentsBase = React.createClass({displayName: 'ChronicleCommentsBase',
    getInitialState: function () {
        return {
            'comments': Comments
        }
    },
    render: function () {
        var commentsDetail = CommentListView({comments: this.state.comments})
        return (React.DOM.span(null, 
            commentsDetail
        ));
    }
});
// render chronicle
React.renderComponent(
  ChronicleCommentsBase(null),
  document.getElementById('project-detail-chronicle')
);