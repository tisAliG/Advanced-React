import React, { Component } from 'react';
import SickButton from './styles/SickButton';

class UserPermissions extends Component {

    constructor( props ) {
        super( props );
    }

    createPermissionInputs = ( possiblePermissions, userId ) => {

        return possiblePermissions.map( ( permission ) => {

            return (
                <td key={ permission }>
                    <label htmlFor={ `${ userId }-${ permission }-permission` }>
                        <input type='checkbox' id={ `${ userId }-${ permission }-permission` } />
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
