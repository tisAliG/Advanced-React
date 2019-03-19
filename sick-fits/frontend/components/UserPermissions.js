import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import SickButton from './styles/SickButton';

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation updatePermissions( $permissions: [ Permission ], $userId: ID! ) {
        updatePermissions( permissions: $permissions, userId: $userId ) {
            id
            permissions
            name
            email
        }
    }
`;

class UserPermissions extends Component {

    constructor( props ) {
        super( props );

        this.state = {
            permissions: this.props.user.permissions
        };
    }

    handlePermissionChange = ( e ) => {

        const checkbox = e.target;

        // take a copy of state, since it's bad practice to update state directly, instead you should take a copy and then overwrite the state with the new data
        let updatedPermissions = [ ...this.state.permissions ];

        if ( checkbox.checked ) {

            updatedPermissions.push( checkbox.value );

        }
        else {

            updatedPermissions = updatedPermissions.filter( ( permission ) => permission !== checkbox.value );
        }

        this.setState( {
            permissions: updatedPermissions
        } );
    };

    createPermissionInputs = ( possiblePermissions, userId ) => {

        return possiblePermissions.map( ( permission ) => {

            return (
                <td key={ permission }>
                    <label htmlFor={ `${ userId }-${ permission }-permission` }>
                        <input
                            type='checkbox'
                            value={ permission }
                            onChange={ this.handlePermissionChange }
                            checked={ this.state.permissions.includes( permission ) }
                            id={ `${ userId }-${ permission }-permission` } />
                    </label>
                </td>
            );
        } );
    };

    render() {

        const user = this.props.user;

        return (
            <Mutation
                mutation={ UPDATE_PERMISSIONS_MUTATION }
                variables={{
                    permissions: this.state.permissions,
                    userId: user.id
                }}
            >
                { ( updatePermissions, { loading, error } ) => (

                    <tr>
                        <td>{ user.name }</td>
                        <td>{ user.email }</td>

                        { this.createPermissionInputs( this.props.possiblePermissions, user.id ) }
                        <td>
                            <SickButton
                                type='button'
                                disabled={ loading }
                                onClick={ updatePermissions }
                            >
                                Updat{ loading ? 'ing' : 'e' }
                            </SickButton>
                        </td>
                    </tr>
                ) }
            </Mutation>
        );
    }
}

export default UserPermissions;
