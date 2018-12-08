import React, { Component } from 'react';
import Meta from '../components/Meta';
import Header from '../components/Header';

class Page extends Component {

    render() {

        return (
            <div>
                <Meta />
                <Header />
                <p>Page comp</p>
                { this.props.children }
            </div>
        );
    }
}

export default Page;