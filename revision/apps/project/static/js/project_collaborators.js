/** @jsx React.DOM */
/**
* Project collaborators
*
*/
// 
var CollaboratorDetailView = React.createClass({displayName: 'CollaboratorDetailView',
    render: function () {
        var user_class = this.props.person.user_class
        var classNames = 'pull-right label';
        if ( user_class === 'owner' ) {
            classNames += ' label-primary';

        } else if (  user_class === 'colleague'  ) {
            classNames += ' label-info';

        } else {
            classNames += ' label-success';

        }
        return (
            React.DOM.li({key: this.props.person.pk, className: "list-group-item"}, 
            React.DOM.span({className: "glyphicon glyphicon-comment"}), " ", this.props.person.name, ":", 
            React.DOM.span({className: classNames}, this.props.person.user_class)
            )
        );
    }
});


var CollaboratorView = React.createClass({displayName: 'CollaboratorView',
    render: function () {
        var name = this.props.name;
        return (
            React.DOM.span(null, 
            React.DOM.span({className: "glyphicon glyphicon-comment"}), " ", name, ":"
            )
        )
    }
});


var CollaboratorListView = React.createClass({displayName: 'CollaboratorListView',
    getInitialState: function () {
        return {
            'project': Project,
        }
    },
    render: function () {
        var collaboratorNodes = this.state.project.collaborators.map(function ( person ) {
            return CollaboratorDetailView({key: person.pk, person: person})
        });

        return (
            React.DOM.span(null, 
              React.DOM.h2(null, "Collaborators"), 
              React.DOM.p(null, "Add new collaborators here"), 
              React.DOM.ul({className: "list-group"}, 
                collaboratorNodes
              )
            )
        );
    }
});