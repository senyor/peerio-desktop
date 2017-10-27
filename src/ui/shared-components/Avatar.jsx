const React = require('react');
const { observer } = require('mobx-react');
const TooltipAvatar = require('~/react-toolbox').TooltipAvatar;
const { FontIcon } = require('~/react-toolbox');
const uiStore = require('~/stores/ui-store');
const { contactStore } = require('~/icebear');

@observer
class Avatar extends React.Component {
    openContactDialog = (ev) => {
        ev.stopPropagation();
        uiStore.contactDialogUsername = this.props.contact ? this.props.contact.username : this.props.username;
    };
    render() {
        const c = this.props.contact || contactStore.getContact(this.props.username);
        const style = { backgroundColor: c.color };
        let icon;
        if (this.props.size !== 'tiny') {
            if (c.isDeleted) {
                icon = <FontIcon value="remove_circle" />;
            } else if (c.tofuError) {
                icon = <FontIcon value="error" />;
            }
        }
        if (c.hasAvatar) style.backgroundImage = `url(${c.mediumAvatarUrl})`;
        const className = `clickable-avatar ${this.props.size || 'medium'}`;
        return (
            <div className="avatar-wrapper">
                <TooltipAvatar tooltip={c.fullNameAndUsername} tooltipDelay={250} tooltipPosition="top"
                    style={style} onClick={this.openContactDialog} className={className}>
                    <div>{c.hasAvatar ? null : c.letter}</div>
                </TooltipAvatar>
                {icon}
            </div>
        );
    }
}

module.exports = Avatar;
