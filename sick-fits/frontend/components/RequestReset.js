import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION( $email: String! ) {
        requestReset(
            email: $email
        ){
            message
        }
    }
`;

class RequestReset extends Component {

    constructor( props ) {
        super( props );

        this.state = {
            email: ''
        };
    }

    saveToState = ( event ) => {

        this.setState( { [ event.target.name ]: event.target.value } );
    };

    render() {
        return (
            <Mutation
                mutation={ REQUEST_RESET_MUTATION }
                variables={ this.state }
            >
                {
                    ( reset, { error, loading, called } ) => {
                        return (
                            <Form method='post' onSubmit={ async ( e ) => {
                                e.preventDefault();
                                await reset();
                                this.setState( { email: '' } );
                            } }>
                                <fieldset disabled={ loading } aria-busy={ loading }>
                                    <h2>Request a password reset</h2>
                                    <Error error={ error } />
                                    { !error && !loading && called && <p>Success! Check your email for the reset link!</p>  }
                                    <label htmlFor='email'>
                                        Email
                                        <input
                                            type='email'
                                            name='email'
                                            placeholder='email'
                                            value={ this.state.email }
                                            onChange={ this.saveToState }
                                        />
                                    </label>
                                    <button type='submit'>Request reset!</button>
                                </fieldset>
                            </Form>
                        );
                    }

                }
            </Mutation>

        );
    }
}

export default RequestReset;
