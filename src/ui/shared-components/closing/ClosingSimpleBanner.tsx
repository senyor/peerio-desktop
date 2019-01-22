import React from 'react';
import Banner from '../Banner';

export default class ClosingSimpleBanner extends React.PureComponent {
    render() {
        return (
            <Banner
                singleLine
                mainContent={
                    <a href="https://www.peerio.com/blog/">Peerio is closing on July 15th, 2019</a>
                }
                theme="error"
            />
        );
    }
}
