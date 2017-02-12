const React = require('react');
// const { IconMenu, MenuItem } = require('~/react-toolbox');
const css = require('classnames');
const { mailStore } = require('~/icebear');


class MailItem extends React.Component {
    handleSelect = () => {
        mailStore.selectedId = this.props.ghostId;
    };

    render() {
        return (
            <div className={css('mail-item', { active: mailStore.selectedId === this.props.ghostId })}
                 onClick={this.handleSelect}>
                <div className="flex-col flex-grow-1">
                    <div className="flex-row">
                        <div style={{ marginRight: 'auto' }}>{this.props.recipient}</div>

                        {this.props.date}
                    </div>
                    <strong className="item-subject">{this.props.subject}</strong>
                    <div className="flex-row flex-align-center">
                        <div style={{ marginRight: 'auto' }}>
                            {this.props.firstLine}
                        </div>
                    </div>
                </div>
                {/* <IconMenu icon="more_vert" className="flex-shrink-0">
                    <MenuItem icon="markunread_mailbox" caption="Mark unread" />
                    <MenuItem icon="thumb_down" caption="Mark junk" />
                    <MenuItem icon="block" caption="Block sender" />
                    <MenuItem icon="delete" caption="Delete" />
                </IconMenu> */}
            </div>
        );
    }
}

module.exports = MailItem;
