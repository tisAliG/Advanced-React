import React, { Component } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import gql from 'graphql-tag';
import Item from './Item';
import Pagination from './Pagination';

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY {
        items {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;

const Center = styled.div`
    text-align: center;
`;

const ItemsList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    max-width: ${ ( props ) => props.theme.maxWidth };
    margin: 0 auto;
`;


class Items extends Component {

    constructor( props ) {

        super( props );
    }

    render() {

        return (
            <Center>
                <Pagination page={ this.props.page } />
                <Query query={ ALL_ITEMS_QUERY }>
                    {
                        ( { data, error, loading } ) => {

                            // console.log( data );

                            if ( loading ) return ( <p>Loading...</p> );
                            if ( error ) return ( <p>ERROR: { error.message }</p> );

                            return (
                                <ItemsList>
                                    { data.items.map( ( item ) => <Item key={ item.id } item={ item } /> ) }
                                </ItemsList>
                            );
                        }
                    }
                </Query>
                <Pagination page={ this.props.page } />
            </Center>
        );

    }

}

export default Items;
export { ALL_ITEMS_QUERY };