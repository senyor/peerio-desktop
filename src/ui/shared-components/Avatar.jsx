// @ts-check

const React = require('react');
const { observer } = require('mobx-react');
const css = require('classnames');
const { TooltipAvatar } = require('~/react-toolbox');
const { FontIcon } = require('~/react-toolbox');
const uiStore = require('~/stores/ui-store');
const { contactStore } = require('peerio-icebear');

/**
 * @augments {React.Component<{
        /// as per icebear/models/contacts/contact.js
        contact? : any
        // either contact OR username is required
        username? : string
        size? : string
        inline? : boolean
        noclick? : boolean
    }, {}>}
 */
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

        const wrapperClassName = css('avatar-wrapper', { 'avatar-inline': this.props.inline });
        const avatarClassName = css(
            'avatar-container',
            `${this.props.size || 'medium'}`,
            { 'clickable-avatar': !this.props.noclick }
        );

        return (
            <div className={wrapperClassName}>
                <TooltipAvatar
                    tooltip={!this.props.noclick && c.fullNameAndUsername} tooltipDelay={250} tooltipPosition="top"
                    style={style} onClick={this.openContactDialog} className={avatarClassName}>
                    <div className="image-container">{c.hasAvatar
                        ? <img src={c.mediumAvatarUrl} alt={c.username} />
                        : c.letter
                    }</div>
                </TooltipAvatar>
                {icon}
            </div>
        );
    }
}

module.exports = Avatar;
