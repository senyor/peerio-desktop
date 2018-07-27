// @ts-check
const React = require('react');

class Beacon extends React.Component {
    render() {
        return (
            /*
                A container wraps the child content and beacon together, to make positioning easy.
                This <div> nesting is a necessary eyesore to allow the container (and therefore the child content) to
                be positioned however is necessary in the view (absolute, fixed, whatever), while the inner content
                can be positioned `relative`, so that the beacon itself can be positioned `absolute`. Whew!

                All of this means that the beacon positioning will be accurate to the child content without expensive
                in-window calculations.
            */
            <div className="beacon-container">
                <div className="beacon-inner">
                    {this.props.children}

                    <div className="beacon" />
                </div>
            </div>
        );
    }
}

module.exports = Beacon;
