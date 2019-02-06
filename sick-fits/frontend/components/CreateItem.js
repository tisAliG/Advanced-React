import React, { Component } from 'react';
import gql from 'graphql-tag';
import Router from 'next/router';
import { Mutation } from 'react-apollo';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItem extends Component {

    // default state
    state = {
        title: 'Cool Shoes',
        description: '',
        image: '',
        largeImage: '',
        price: 0
    };

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

    render() {
        return (
            <Mutation
                mutation={ CREATE_ITEM_MUTATION }
                variables={ this.state }
            >
                { ( createItem, { loading, error, called, data } ) => {
                    return (
                        <Form onSubmit={ ( event ) => this.handleSubmit( event, createItem ) }>
                            <Error error={ error } />
                            <fieldset disabled={ loading } aria-busy={ loading }>
                                <label htmlFor='title'>Title</label>
                                <input
                                    type='text'
                                    id='title'
                                    name='title'
                                    placeholder='title'
                                    value={ this.state.title }
                                    onChange={ this.handleChange }
                                    required
                                />

                                <label htmlFor='description'>Description</label>
                                <textarea
                                    id='description'
                                    name='description'
                                    placeholder='Enter a Description'
                                    value={ this.state.description }
                                    onChange={ this.handleChange }
                                    required
                                />

                                <label htmlFor='price'>Price</label>
                                <input
                                    type='number'
                                    id='price'
                                    name='price'
                                    placeholder={ 0 }
                                    value={ this.state.price }
                                    onChange={ this.handleChange }
                                    required
                                />

                                <button type='submit'>Submit</button>
                            </fieldset>
                        </Form>
                    );
                } }
            </Mutation>
        );
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
