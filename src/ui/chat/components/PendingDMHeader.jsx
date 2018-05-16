const React = require('react');

const T = require('~/ui/shared-components/T');

const { Avatar } = require('~/peer-ui');
const EmojiImage = require('~/ui/emoji/Image');
const IdentityVerificationNotice = require('~/ui/chat/components/IdentityVerificationNotice');

class PendingDMHeader extends React.Component {
    render() {
        return (
            <div className="pending-dm-header">
                <EmojiImage emoji="tada" size="large" />

                <T className="main-text"
                    k={this.props.isNewUser
                        ? 'title_newUserDmInviteHeading'
                        : 'title_dmInviteHeading'
                    }
                >
                    {{ contactName: this.props.contact.fullName }}
                </T>

                <div className="user-profile-container">
                    <Avatar username={this.props.contact.username} size="large" clickable />
                    <div className="username">@{this.props.contact.username}</div>
                </div>

                <IdentityVerificationNotice />
            </div>
        );
    }
}

module.exports = PendingDMHeader;
