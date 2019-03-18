import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Table from './styles/Table';
import UserPermissions from './UserPermissions';

// TODO: create a query to get all of these from the db (reduce duplication, or if anything changes in the future) (enum on BE) OR put this in a localized place.
const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE'
];

const ALL_USERS_QUERY = gql`
    query {
        users {
            id
            name
            email
            permissions
        }
    }
`;

class Permissions extends Component {

    createPermissionHeaders = () => {

        return possiblePermissions.map( ( permission, index ) => <th key={ index }>{ permission }</th> );
    };

    createUserRow = ( users ) => {

        return users.map( ( user, uIndex ) => {
            return (
                <tr key={ uIndex }>
                    <td>{ user.name }</td>
                    <td>{ user.email }</td>

                    { /* Can we simplify this, or make it easier to understand */possiblePermissions.map( ( permission, pIndex ) => {

                        return (
                            <td key={ pIndex }>
                                <label htmlFor={ `${ user.id }-${ permission }-permission` }>
                                    <input type='checkbox' />
                                </label>
                            </td>
                        );
                    } ) }
                    <td><SickButton>Update</SickButton></td>
                </tr>
            );
        } );
    };

    render() {

        return(
            <Query query={ ALL_USERS_QUERY }>
                {
                    ( { data, error } ) => (
                        <div>
                            <Error error={ error } />
                            <h2>Manage Permissions</h2>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        { this.createPermissionHeaders() }
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { data.users.map( ( user ) => {

                                        return ( <UserPermissions
                                            key={ user.id }
                                            user={ user }
                                            possiblePermissions={ possiblePermissions }
                                        /> );
                                    } ) }
                                </tbody>
                            </Table>
                        </div>
                    )

                }
            </Query>
        );
    }
}

export default Permissions;
