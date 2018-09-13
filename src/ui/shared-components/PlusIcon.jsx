import Beacon from '~/ui/shared-components/Beacon';
const React = require('react');
const css = require('classnames');

class PlusIcon extends React.PureComponent {
    get icon() {
        return this.props.beacon ? (
            <Beacon name={this.props.beacon} type="spot" size={48}>
                <span className="plus-icon">+</span>
            </Beacon>
        ) : (
            <span className="plus-icon">+</span>
        );
    }
    render() {
        return (
            <span
                className={css('plus-icon-container', this.props.className, {
                    clickable: !!this.props.onClick
                })}
                onClick={this.props.onClick}
            >
                {this.props.label && (
                    <span className="label">{this.props.label}</span>
                )}
                {this.icon}
            </span>
        );
    }
}

module.exports = PlusIcon;
