const React = require('react');
const { observer } = require('mobx-react');
const RTAvatar = require('~/react-toolbox').Avatar;
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
        if (c.hasAvatar) style.backgroundImage = `url(${c.mediumAvatarUrl})`;
        const className = `clickable-avatar ${this.props.size || 'medium'}`;
        return (
            <div className="avatar-wrapper">
                <RTAvatar style={style} onClick={this.openContactDialog} className={className}>
                    <div>{c.hasAvatar ? null : c.letter}</div>
                </RTAvatar>
                {c.tofuError ? <FontIcon value="error" /> : null}
            </div>
        );
    }
}

module.exports = Avatar;
