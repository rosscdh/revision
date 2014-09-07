/** @jsx React.DOM */
/**
* Project chronicle controls
*
*/
var ChronicleVideoBase = React.createClass({
    getInitialState: function () {
        return {
            'video': Video
        }
    },
    render: function () {
        var FlowPlayer = <FlowPlayerView video={this.state.video} />
        return (<span>
            {FlowPlayer}
        </span>);
    }
});
// render chronicle
React.renderComponent(
  <ChronicleVideoBase />,
  document.getElementById('project-detail-video')
);


var ChronicleCommentsBase = React.createClass({
    getInitialState: function () {
        return {
            'comments': Comments
        }
    },
    render: function () {
        var commentsDetail = <CommentListView comments={this.state.comments} />
        return (<span>
            {commentsDetail}
        </span>);
    }
});
// render chronicle
React.renderComponent(
  <ChronicleCommentsBase />,
  document.getElementById('project-detail-chronicle')
);