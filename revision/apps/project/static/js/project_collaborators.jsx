/** @jsx React.DOM */
/**
* Project collaborators
*
*/
var CollaboratorFormModal = React.createClass({
    getInitialState: function () {
        return {
            'project': Project,
            'message': 'Please enter an email address',
            'message_class': 'label-info',
            'is_disabled': true,
            'show_name_fields': false,
        }
    },
    isAlreadyCollaborating: function ( email ) {
        var is_collaborating = false;
        var collaborators = this.state.project.collaborators;

        for ( var i = 0; i < collaborators.length; i++ ) {
            if ( collaborators[i].email == email ) {
                is_collaborating = true;
                break;
            }
        }
        return is_collaborating;
    },
    onCheckCollaboratorExists: function ( event ) {
        var self = this;
        var searchEvent;
        var email = this.refs.email.getDOMNode().value.trim();
        var is_collaborating = this.isAlreadyCollaborating( email );

        if ( is_collaborating === false ) {
            var form = $('<form data-parsley-validate/>');
            form.append($('<input type="email" data-parsley-required="true" data-parsley-type="email" value="{email}" />'.assign({'email': email})))

            if ( form.parsley().isValid() === true ) {

                clearTimeout( searchEvent );

                searchEvent = setTimeout( function () {
                    UserResource.list( {'email': email} ).defer().done(function ( data ) {
                        var show_name_fields = false;
                        if ( data.results.length === 0 ) {
                            show_name_fields = true;
                        }
                        // show the fields
                        self.setState({
                            'message': ( show_name_fields === false ) ? '{email} was found, press add to add as collaborator.'.assign({'email': email}) : '{email} was not found, please provide their details to continue.'.assign({'email': email}),
                            'message_class': 'label-info',
                            'show_name_fields': show_name_fields,
                            'is_disabled': false
                        });
                    });
                }, 900 );
            }

            self.setState({
                'message': '',
                'message_class': 'label-info',
                'show_name_fields': false,
                'is_disabled': true
            });
        } else {
            self.setState({
                'message': '{email} is already a collaborator'.assign({'email': email}),
                'message_class': 'label-warning',
            });
        } // end if is_collaborating
    },
    onSubmitForm: function ( event ) {
        var self = this;

        if ( $(event.target).parsley().isValid() === true ) {

            var email = this.refs.email.getDOMNode().value.trim();
            var first_name = this.refs.first_name.getDOMNode().value.trim();
            var last_name = this.refs.last_name.getDOMNode().value.trim();

            CollaboratorResource.create( email, first_name, last_name ).defer().done(function ( data ) {

                // self.props.onVideoUpdate( video_data );
                $( '#modal-new-collaborator' ).modal('hide');
                //document.location = video_data.video_url;
                document.location.reload();

            });
        }
        return false;
    },
    render: function () {

        var showFieldsClass = (this.state.show_name_fields === true) ? '' : 'hide';
        var disabled = (this.state.is_disabled === true) ? 'disabled' : '' ;
        var message = this.state.message;
        var messageClass = 'label {message_class}'.assign({'message_class': this.state.message_class});

        return (<div id="modal-new-collaborator" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="modal-new-collaborator-help" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                    <h4 className="modal-title" id="myModalLabel">New Collaborator</h4>
                </div>
                <div className="modal-body">
                    <div className="row">
                        <p className={messageClass}>{message}</p>
                        <form onSubmit={this.onSubmitForm} data-parsley-validate>
                        <label htmlFor="id_email">Email Address:</label><input ref="email" onChange={this.onCheckCollaboratorExists} data-parsley-maxlength="200" data-parsley-required="true" data-parsley-required-message="This field is required." data-parsley-type="email" data-parsley-type-url-message="Enter a valid Email Address." id="id_email" maxlength="200" name="email" type="email" />
                            <div className={showFieldsClass}>
                                <label htmlFor="id_first_name">First name:</label><input ref="first_name" data-parsley-maxlength="255" data-parsley-required-message="This field is required." id="id_first_name" maxlength="255" name="first_name" type="text" />
                                <label htmlFor="id_last_name">Last name:</label><input ref="last_name" data-parsley-maxlength="255" data-parsley-required-message="This field is required." id="id_last_name" maxlength="255" name="last_name" type="text" />
                            </div>
                            <input type="submit" value="Add" disabled={disabled} />
                        </form>
                    </div>
                </div>
            </div>
          </div>
        </div>);
    }
});

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
        var collaboratorFormModal = <CollaboratorFormModal />
        var collaboratorNodes = this.state.project.collaborators.map(function ( person ) {
            return <CollaboratorDetailView key={person.pk} person={person} />
        });

        return (
            <span>
              <h2>Collaborators</h2>
              <p><a href="#" className="btn btn-success" data-toggle="modal" data-target="#modal-new-collaborator">New Collaborator</a></p>
              <ul className="list-group">
                {collaboratorNodes}
              </ul>
              {collaboratorFormModal}
            </span>
        );
    }
});