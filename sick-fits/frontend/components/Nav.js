import React from 'react';
import Link from 'next/link';
import { Mutation } from 'react-apollo';
import User from './User';
import Signout from './Signout';
import { TOGGLE_CART_MUTATION } from './Cart';
import NavStyles from './styles/NavStyles';

const Nav = () => (
    <User>
        {
            /* inital arg is 'payload', but we are destructuring it to 'data', and then desctructuring 'data' to get 'me'*/
            ( { data: { me } } ) => (
                <NavStyles>
                    <Link href='/items'>
                        <a>Shop</a>
                    </Link>
                    { me ? (
                        <React.Fragment>
                            <Link href='/sell'>
                                <a>Sell</a>
                            </Link>
                            <Link href='/orders'>
                                <a>Orders</a>
                            </Link>
                            <Link href='/me'>
                                <a>Account</a>
                            </Link>
                            <Signout />
                            <Mutation mutation={ TOGGLE_CART_MUTATION }>
                                { ( toggleCart ) => (
                                    <button onClick={ toggleCart }>My Cart</button>
                                ) }
                            </Mutation>
                        </React.Fragment>
                    ) : (
                        <Link href='/signup'>
                            <a>Signup</a>
                        </Link>
                    ) }
                </NavStyles>
            )
        }
    </User>
);

export default Nav;