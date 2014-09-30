/** @jsx React.DOM */
/**
*
*/
var PublishedVideo = React.createClass({displayName: 'PublishedVideo',
    getInitialState: function () {
        return {
            'video': Video,
            'flowplayer': null,
        }
    },
    render: function () {
        var flowPlayer = FlowPlayerView({video: this.state.video})

        return (React.DOM.div({className: "row"}, 
                flowPlayer
        ));
    }
});
// render chronicle
React.renderComponent(
  PublishedVideo(null),
  document.getElementById('published-detail')
);