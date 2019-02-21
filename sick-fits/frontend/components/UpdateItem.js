import React, { Component } from 'react';
import gql from 'graphql-tag';
import Router from 'next/router';
import { Mutation, Query } from 'react-apollo';

import Form from './styles/Form';
// import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY( $id: ID! ) {
        item( where: { id: $id } ) {
            id
            title
            description
            price
        }
    }
`;

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
        ) {
            id
            title
            description
            price
        }
    }
`;

class UpdateItem extends Component {

    // default state
    state = {};

    constructor( props ) {

        super( props );

    }

    handleChange = ( event ) => {

        const { name, type, value } = event.target;
        const val = type === 'number' ? parseFloat( value ) : value;

        this.setState( { [ name ]: val } );

    };

    handleSubmit = async ( event, createItem ) => {
        // stop form from submitting
        event.preventDefault();
        // call the mutation
        const res = await createItem();

        // route user to the single item page
        console.log( res );
        Router.push( {
            pathname: '/item',
            query: { id: res.data.createItem.id }
        } );

    };

    updateItem = async ( event, updateItemMutation ) => {

        event.preventDefault();
        console.log( 'Updating item' );
        console.log( this.state );

        const response = await updateItemMutation( {
            variables: {
                id: this.props.id,
                ...this.state
            }
        } );

        console.log( response );

    };

    render() {

        // OMG.. so much indentation, need to think about a way to clean this up, it's painful to look at!

        return (
            <Query query={ SINGLE_ITEM_QUERY } variables={{ id: this.props.id }}>
                {
                    ( { data, loading } ) => {

                        if ( loading ) return <p>Loading..</p>;

                        if ( !data.item ) return <p>No Item Found for ID: { this.props.id }</p>;

                        return (
                            <Mutation mutation={ UPDATE_ITEM_MUTATION } variables={ this.state }>
                                { ( updateItem, { loading, error } ) => {
                                    return (
                                        <Form onSubmit={ ( event ) => this.updateItem( event, updateItem ) }>
                                            <Error error={ error } />
                                            <fieldset disabled={ loading } aria-busy={ loading }>

                                                <label htmlFor='title'>
                                                    Title
                                                    <input
                                                        type='text'
                                                        id='title'
                                                        name='title'
                                                        placeholder='title'
                                                        defaultValue={ data.item.title }
                                                        onChange={ this.handleChange }
                                                        required
                                                    />
                                                </label>

                                                <label htmlFor='description'>
                                                    Description
                                                    <textarea
                                                        id='description'
                                                        name='description'
                                                        placeholder='Enter a Description'
                                                        defaultValue={ data.item.description }
                                                        onChange={ this.handleChange }
                                                        required
                                                    />
                                                </label>

                                                <label htmlFor='price'>
                                                    Price
                                                    <input
                                                        type='number'
                                                        id='price'
                                                        name='price'
                                                        placeholder={ 0 }
                                                        defaultValue={ data.item.price }
                                                        onChange={ this.handleChange }
                                                        required
                                                    />
                                                </label>

                                                <button type='submit'>Sav{ loading ? 'ing' : 'e' } Changes</button>
                                            </fieldset>
                                        </Form>
                                    );
                                } }
                            </Mutation>
                        );
                    }
                }
            </Query>
        );
    }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
