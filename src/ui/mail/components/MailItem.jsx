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
            <div className={css('mail-item', { active: mailStore.selectedId === this.props.ghostId, draft: !this.props.sent })}
                 onClick={this.handleSelect}>
                <div className="flex-col flex-grow-1 flex-justify-between">
                    <div className="flex-row">

                        <strong className="item-subject">{this.props.subject}</strong>
                        {this.props.date}
                    </div>
                    <div>{this.props.recipient}</div>
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
