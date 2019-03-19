import React, { Component } from 'react';
import SickButton from './styles/SickButton';

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
        const updatedPermissions = [ ...this.state.permissions ];

        if ( checkbox.checked ) {

            updatedPermissions.push( checkbox.value );

        }
        else {

            updatedPermissions.filter( ( permission ) => permission !== checkbox.value );
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
            <tr>
                <td>{ user.name }</td>
                <td>{ user.email }</td>

                { this.createPermissionInputs( this.props.possiblePermissions, user.id ) }
                <td><SickButton>Update</SickButton></td>
            </tr>
        );
    }
}

export default UserPermissions;
