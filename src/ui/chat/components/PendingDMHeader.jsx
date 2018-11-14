import React from 'react';
import { observer } from 'mobx-react';

import { chatStore } from 'peerio-icebear';

import T from '~/ui/shared-components/T';
import AvatarWithPopup from '~/ui/contact/components/AvatarWithPopup';
import EmojiImage from '~/ui/emoji/Image';
import IdentityVerificationNotice from '~/ui/chat/components/IdentityVerificationNotice';

@observer
export default class PendingDMHeader extends React.Component {
    render() {
        const c = this.props.contact;
        const chat = chatStore.activeChat;

        return (
            <div className="pending-dm-header">
                <EmojiImage emoji="tada" size="large" />

                {this.props.isNewUser ? (
                    <T k="title_newUserDmInviteHeading" className="main-text">
                        {{ contactName: c.fullName }}
                    </T>
                ) : (
                    <div className="main-text">
                        <T k="title_goodNews" />
                        <br />
                        <T k="title_dmInviteHeading">{{ contactName: c.fullName }}</T>
                    </div>
                )}

                {this.props.isNewUser ? null : (
                    <T
                        k={
                            chat.isAutoImport
                                ? 'title_userInAddressBook'
                                : 'title_invitedUserViaEmail'
                        }
                        className="invite-type"
                    >
                        {{ firstName: c.firstName, email: chat.email }}
                    </T>
                )}

                <div className="user-profile-container">
                    <AvatarWithPopup contact={c} size="large" />
                    <div className="username">@{c.username}</div>
                </div>

                <IdentityVerificationNotice />
            </div>
        );
    }
}
