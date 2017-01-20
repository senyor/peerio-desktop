const React = require('react');
const { IconMenu, MenuItem } = require('~/react-toolbox');
const css = require('classnames');

class MailItem extends React.Component {
    render() {
        return (
            <div className={css('mail-item', { active: this.props.active })}>
                <div className="flex-row" style={{ paddingRight: '8px' }}>
                    <strong style={{ marginRight: 'auto' }}>{this.props.title}</strong>
                    {this.props.date}
                </div>
                <div>{this.props.recipient}</div>
                <div className="flex-row flex-align-center">
                    <div style={{ marginRight: 'auto' }}>
                        {this.props.firstLine}
                    </div>
                    <IconMenu icon="more_vert">
                        <MenuItem icon="markunread_mailbox" caption="Mark unread" />
                        <MenuItem icon="thumb_down" caption="Mark junk" />
                        <MenuItem icon="block" caption="Block sender" />
                        <MenuItem icon="delete" caption="Delete" />
                    </IconMenu>
                </div>
            </div>
        );
    }
}

module.exports = MailItem;
