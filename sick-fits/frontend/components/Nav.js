import React from 'react';
import Link from 'next/link';
import User from './User';
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