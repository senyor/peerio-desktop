// @ts-check
const React = require('react');

class Beacon extends React.Component {
    render() {
        return (
            <div className="beacon-container">
                <div className="beacon-inner">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

module.exports = Beacon;
