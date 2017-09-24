const React = require('react');
const { observer } = require('mobx-react');
const { List, ListItem, ListSubHeader, IconMenu, MenuItem } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore, contactStore, chatInviteStore } = require('~/icebear');
const { t } = require('peerio-translator');
const { getAttributeInParentChain } = require('~/helpers/dom');
const uiStore = require('~/stores/ui-store');
const T = require('~/ui/shared-components/T');
const SideBarSection = require('./SideBarSection');

@observer
class MembersSection extends React.Component {
    openContact(ev) {
        const username = getAttributeInParentChain(ev.target, 'data-username');
        uiStore.contactDialogUsername = username;
    }

    deleteInvite(ev) {
        ev.stopPropagation();
        const username = getAttributeInParentChain(ev.target, 'data-username');
        chatInviteStore.revokeInvite(chatStore.activeChat.id, username);
    }

    deleteParticipant(ev) {
        ev.stopPropagation();
        const username = getAttributeInParentChain(ev.target, 'data-username');
        chatStore.activeChat.removeParticipant(username);
    }

    makeAdmin(ev) {
        ev.stopPropagation();
        const username = getAttributeInParentChain(ev.target, 'data-username');
        chatStore.activeChat.promoteToAdmin(contactStore.getContact(username));
    }

    demoteAdmin(ev) {
        ev.stopPropagation();
        const username = getAttributeInParentChain(ev.target, 'data-username');
        chatStore.activeChat.demoteAdmin(contactStore.getContact(username));
    }
    stopPropagation(ev) {
        ev.stopPropagation();
    }

    renderJoinedParticipant = (c, chat, adminMenu, userMenu) => {
        return (<span data-username={c.username} key={c.username}>
            <ListItem
                leftActions={[<Avatar key="a" contact={c} size="small" />]}
                itemContent={
                    <span className="rt-list-itemContentRoot rt-list-large">
                        <span className="rt-list-itemText rt-list-primary">
                            {c.username}{chat.isAdmin(c) ? <T k="title_admin" className="tag" /> : null}
                        </span>
                        <span className="rt-list-itemText">
                            {c.fullName}
                        </span>
                    </span>
                }
                rightActions={chat.isAdmin(c) ? adminMenu : userMenu}
                onClick={this.openContact}
            />
        </span>);
    }

    renderInvitedParticipant = (c, inviteMenu) => {
        return (<span data-username={c.username} key={`invited--${c.username}`}>
            <ListItem
                caption={c.username}
                rightActions={inviteMenu}
                onClick={this.openContact}
            />
        </span>);
    };

    render() {
        const chat = chatStore.activeChat;
        if (!chat) return null;
        const invited = chatInviteStore.sent.get(chat.id);
        const { isChannel, canIAdmin } = chat;

        const userMenu = [], adminMenu = [], inviteMenu = [];
        if (isChannel && canIAdmin) {
            userMenu.push(<IconMenu key="0" icon="more_vert" position="bottomRight" menuRipple onClick={this.stopPropagation}>
                <MenuItem value="make_admin" icon="account_balance" caption={t('button_makeAdmin')} onClick={this.makeAdmin} />
                <MenuItem value="delete" icon="delete" caption={t('button_remove')} onClick={this.deleteParticipant} />
            </IconMenu>);

            adminMenu.push(<IconMenu key="0" icon="more_vert" position="bottomRight" menuRipple onClick={this.stopPropagation}>
                <MenuItem value="demote_admin" icon="cancel" caption={t('button_demoteAdmin')} onClick={this.demoteAdmin} />
                <MenuItem value="delete" icon="delete" caption={t('button_remove')} onClick={this.deleteParticipant} />
            </IconMenu>);

            inviteMenu.push(<IconMenu key="0" icon="more_vert" position="bottomRight" menuRipple onClick={this.stopPropagation}>
                <MenuItem value="delete" icon="delete" caption={t('button_remove')} onClick={this.deleteInvite} />
            </IconMenu>);
        }

        return (
            <SideBarSection title={t('title_Members')}>
                <List>
                    {chat.joinedParticipants
                        ? chat.joinedParticipants.map((c) => this.renderJoinedParticipant(c, chat, adminMenu, userMenu))
                        : null}
                    {invited && invited.length
                        ? <ListSubHeader caption={t('title_invited')} />
                        : null}
                    {invited
                        ? invited.map((c) => this.renderInvitedParticipant(c, inviteMenu))
                        : null}
                    {isChannel && canIAdmin
                        ? <ListItem
                            className="admin-controls"
                            caption={t('button_inviteToChannel')}
                            onClick={this.props.onAddParticipants} />
                        : null
                    }
                </List>
            </SideBarSection>
        );
    }
}

module.exports = MembersSection;
