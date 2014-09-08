/** @jsx React.DOM */
/**
* Project chronicle controls
*
*/
var ChronicleCommentsBase = React.createClass({displayName: 'ChronicleCommentsBase',
    getInitialState: function () {
        return {
            'comments': Comments,
            'video': Video,
            'progress': 0,
            'flowplayer': null,
        }
    },
    onVideoUpdate: function ( video ) {
        this.setState({
            'video': video
        });
    },
    onSeekTo: function () {
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
            api.conf.debug = false;
            api.conf.engine = 'html5';
            api.conf.preload = 'auto';
            api.conf.keyboard = false;

            api.bind("progress", function ( event, ob, progress ) {
                self.state.video.timestamp = progress;
                self.setState({
                    'progress': progress
                });
            });
            // set the state handler
            self.setState({
                'flowplayer': api
            });

        });
    },
    render: function () {
        var flowPlayer = FlowPlayerView({video: this.state.video})
        var commentsDetail = CommentListView({comments: this.state.comments, 
                                              onVideoUpdate: this.onVideoUpdate, 
                                              onSeekTo: this.onSeekTo})
        return (React.DOM.div({className: "row"}, 
            React.DOM.div({className: "col-md-7"}, 
                flowPlayer
            ), 
            React.DOM.div({className: "col-md-5"}, 
                commentsDetail
            )
        ));
    }
});
// render chronicle
React.renderComponent(
  ChronicleCommentsBase(null),
  document.getElementById('project-detail-chronicle')
);