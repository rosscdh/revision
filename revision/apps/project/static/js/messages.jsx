/** @jsx React.DOM */
/**
* Generic Messages holder
*
*/
var MessageItem = React.createClass({
    render: function () {

        var message = this.props.message;
        var rowClass = "alert alert-{type}".assign({'type': message.type || 'info'});

        return (<li role="alert" className={rowClass}>
            {message.message}
        </li>);
    }
});

var Messages = React.createClass({
    render: function () {
        var message_set = this.props.messages || [];
        var messages = message_set.map( function( message ) {
            return <MessageItem message={message} />;
        });
        console.log(message_set)
        showOrHideCss = (message_set.length > 0)? 'row col-xs-12' : 'row col-xs-12 hide';

        return (<ul className={showOrHideCss}>
            {messages}
        </ul>);
    }
});