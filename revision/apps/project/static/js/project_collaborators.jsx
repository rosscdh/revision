/** @jsx React.DOM */
/**
* Project collaborators
*
*/
// 
var CollaboratorDetailView = React.createClass({
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
            <li key={this.props.person.pk} className="list-group-item">
            <span className="glyphicon glyphicon-comment"></span> {this.props.person.name}:
            <span className={classNames}>{this.props.person.user_class}</span>
            </li>
        );
    }
});


var CollaboratorView = React.createClass({
    render: function () {
        var name = this.props.name;
        return (
            <span>
            <span className="glyphicon glyphicon-comment"></span> {name}:
            </span>
        )
    }
});


var CollaboratorListView = React.createClass({
    getInitialState: function () {
        return {
            'project': Project,
        }
    },
    render: function () {
        var collaboratorNodes = this.state.project.collaborators.map(function ( person ) {
            return <CollaboratorDetailView key={person.pk} person={person} />
        });

        return (
            <span>
              <h2>Collaborators</h2>
              <p>Add new collaborators here</p>
              <ul className="list-group">
                {collaboratorNodes}
              </ul>
            </span>
        );
    }
});