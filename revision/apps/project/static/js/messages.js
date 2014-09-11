/** @jsx React.DOM */
/**
* Generic Messages holder
*
*/
var MessageItem = React.createClass({displayName: 'MessageItem',
    render: function () {

        var message = this.props.message;
        var rowClass = "alert alert-{type}".assign({'type': message.type || 'info'});

        return (React.DOM.li({role: "alert", className: rowClass}, 
            message.message
        ));
    }
});

var Messages = React.createClass({displayName: 'Messages',
    render: function () {
        var message_set = this.props.messages || [];
        var messages = message_set.map( function( message ) {
            return MessageItem({message: message});
        });
        console.log(message_set)
        showOrHideCss = (message_set.length > 0)? 'row col-xs-12' : 'row col-xs-12 hide';

        return (React.DOM.ul({className: showOrHideCss}, 
            messages
        ));
    }
});