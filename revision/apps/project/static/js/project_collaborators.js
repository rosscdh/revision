/** @jsx React.DOM */
/**
* Project collaborators
*
*/
var CollaboratorFormModal = React.createClass({displayName: 'CollaboratorFormModal',
    getInitialState: function () {
        return {
            'project': Project,
            'is_disabled': true,
            'show_name_fields': false,
        }
    },
    onCheckCollaboratorExists: function ( event ) {
        var self = this;
        var searchEvent;
        var email = this.refs.email.getDOMNode().value.trim();
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
                        'show_name_fields': show_name_fields,
                        'is_disabled': false
                    });
                });
            }, 900 );
        }

        self.setState({
            'show_name_fields': false,
            'is_disabled': true
        });
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

        return (React.DOM.div({id: "modal-new-collaborator", className: "modal fade bs-example-modal-lg", tabIndex: "-1", role: "dialog", 'aria-labelledby': "modal-new-collaborator-help", 'aria-hidden': "true"}, 
          React.DOM.div({className: "modal-dialog modal-lg"}, 
            React.DOM.div({className: "modal-content"}, 
                React.DOM.div({className: "modal-header"}, 
                    React.DOM.button({type: "button", className: "close", 'data-dismiss': "modal"}, React.DOM.span({'aria-hidden': "true"}, "×"), React.DOM.span({className: "sr-only"}, "Close")), 
                    React.DOM.h4({className: "modal-title", id: "myModalLabel"}, "New Collaborator")
                ), 
                React.DOM.div({className: "modal-body"}, 
                    React.DOM.div({className: "row"}, 
                        React.DOM.form({onSubmit: this.onSubmitForm, 'data-parsley-validate': true}, 
                        React.DOM.label({htmlFor: "id_email"}, "Email Address:"), React.DOM.input({ref: "email", onChange: this.onCheckCollaboratorExists, 'data-parsley-maxlength': "200", 'data-parsley-required': "true", 'data-parsley-required-message': "This field is required.", 'data-parsley-type': "email", 'data-parsley-type-url-message': "Enter a valid Email Address.", id: "id_email", maxlength: "200", name: "email", type: "email"}), 
                            React.DOM.div({className: showFieldsClass}, 
                                React.DOM.label({htmlFor: "id_first_name"}, "First name:"), React.DOM.input({ref: "first_name", 'data-parsley-maxlength': "255", 'data-parsley-required': "true", 'data-parsley-required-message': "This field is required.", id: "id_first_name", maxlength: "255", name: "first_name", type: "text"}), 
                                React.DOM.label({htmlFor: "id_last_name"}, "Last name:"), React.DOM.input({ref: "last_name", 'data-parsley-maxlength': "255", 'data-parsley-required': "true", 'data-parsley-required-message': "This field is required.", id: "id_last_name", maxlength: "255", name: "last_name", type: "text"})
                            ), 
                            React.DOM.input({type: "submit", value: "Add", disabled: disabled})
                        )
                    )
                )
            )
          )
        ));
    }
});

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
        var collaboratorFormModal = CollaboratorFormModal(null)
        var collaboratorNodes = this.state.project.collaborators.map(function ( person ) {
            return CollaboratorDetailView({key: person.pk, person: person})
        });

        return (
            React.DOM.span(null, 
              React.DOM.h2(null, "Collaborators"), 
              React.DOM.p(null, React.DOM.a({href: "#", className: "btn btn-success", 'data-toggle': "modal", 'data-target': "#modal-new-collaborator"}, "New Collaborator")), 
              React.DOM.ul({className: "list-group"}, 
                collaboratorNodes
              ), 
              collaboratorFormModal
            )
        );
    }
});