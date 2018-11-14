import React from 'react';
import { Button } from 'peer-ui';
import css from 'classnames';
import { observer } from 'mobx-react';

@observer
class AppNav extends React.Component {
    render() {
        return (
            <div
                className={css('menu-item', { active: this.props.active })}
                onClick={this.props.onClick}
            >
                <Button
                    tooltip={this.props.tooltip}
                    tooltipPosition="right"
                    icon={this.props.icon}
                />
                <div className={this.props.showBadge ? 'look-at-me' : 'banish'} />
            </div>
        );
    }
}

export default AppNav;
