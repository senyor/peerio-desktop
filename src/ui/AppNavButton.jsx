const React = require('react');
const { IconButton, Tooltip } = require('~/react-toolbox');
const css = require('classnames');
const { observer } = require('mobx-react');

const TooltipIcon = Tooltip()(IconButton); //eslint-disable-line

@observer
class AppNav extends React.Component {
    render() {
        return (
            <div className={css('menu-item', { active: this.props.active })}>
                <TooltipIcon
                    tooltip={this.props.tooltip}
                    tooltipDelay={500}
                    tooltipPosition="right"
                    icon={this.props.icon}
                    onClick={this.props.onClick} />
                <div className={this.props.showBadge ? 'look-at-me' : 'banish'}>
                    {this.props.badge}
                </div>
            </div>
        );
    }
}

module.exports = AppNav;
