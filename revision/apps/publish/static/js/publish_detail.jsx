/** @jsx React.DOM */
/**
*
*/
var PublishedVideo = React.createClass({
    getInitialState: function () {
        return {
            'video': Video,
            'flowplayer': null,
        }
    },
    render: function () {
        var flowPlayer = <FlowPlayerView video={this.state.video} />

        return (<div className="row">
                {flowPlayer}
        </div>);
    }
});
// render chronicle
React.renderComponent(
  <PublishedVideo />,
  document.getElementById('published-detail')
);