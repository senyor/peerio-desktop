const React = require('react');

class PoweredBy extends React.Component {
    style = {
        display: 'block',
        width: '25%'
    };

    render() {
        return (
            <img
                style={this.style}
                alt="Powered by Peerio"
                src="static/img/poweredByPeerio_white.png" />
        );
    }
}

module.exports = PoweredBy;
