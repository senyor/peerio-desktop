import React from 'react';

// @observer
export default class PoweredBy extends React.Component {
    render() {
        return (
            <img
                className="poweredBy"
                alt="Powered by Peerio"
                src="static/img/poweredByPeerio_colour.png"
            />
        );
    }
}
