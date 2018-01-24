const React = require('react');
const Tooltip = require('./Tooltip');

/*
    PROPS           type        description
    ----------------------------------------
    className       string
    icon            string      Material Icon name with underscores for spaces

    tooltip         string
    tooltipPosition string
    ----------------------------------------

    TODO: size (rarely deviates from 24px, currently handled at CSS level)
*/

class MaterialIcon extends React.Component {
    render() {
        const classNames = this.props.className
            ? `material-icons ${this.props.className}`
            : 'material-icons';

        return (
            <span className={classNames}>
                {this.props.icon}
                {this.props.tooltip
                    ? <Tooltip text={this.props.tooltip}
                        position={this.props.tooltipPosition}
                    />
                    : null
                }
            </span>
        );
    }
}

module.exports = MaterialIcon;
