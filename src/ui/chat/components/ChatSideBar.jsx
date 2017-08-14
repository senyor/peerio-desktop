const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, List, ListItem, TooltipIconButton, ListSubHeader, IconMenu, MenuItem, MenuDivider } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore, contactStore, chatInviteStore } = require('~/icebear');
const { t } = require('peerio-translator');
const css = require('classnames');
const ChatNameEditor = require('./ChatNameEditor');
const { getAttributeInParentChain } = require('~/helpers/dom');
const uiStore = require('~/stores/ui-store');
const T = require('~/ui/shared-components/T');

@observer
class ChatSideBar extends React.Component {
    @observable listClosed = false;
    // startChat(ev) {
    //     const username = getAttributeInParentChain(ev.target, 'data-id');
    //     chatStore.startChat([contactStore.getContact(username)]);
    // }

    toggleList = () => {
        this.listClosed = !this.listClosed;
    }

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

    deleteChannel() {
        const chat = chatStore.activeChat;
        if (!chat) return;
        if (confirm(t('title_confirmChannelDelete'))) {
            try {
                chat.delete();
            } catch (err) {
                console.error(err);
            }
        }
    }

    leaveChannel() {
        const chat = chatStore.activeChat;
        if (!chat) return;
        if (confirm(t('title_confirmChannelLeave'))) {
            try {
                chat.leave();
            } catch (err) {
                console.error(err);
            }
        }
    }

    stopPropagation(ev) {
        ev.stopPropagation();
    }

    render() {
        const chat = chatStore.activeChat;
        if (!chat) return null;
        const { isChannel, canIAdmin, canILeave } = chat;

        const invited = chatInviteStore.sent.get(chat.id);

        const banishHeader = chat.participants && chat.participants.length ? '' : 'banish';

        const userMenu = [], adminMenu = [], inviteMenu = [];
        if (isChannel && canIAdmin) {
            userMenu.push(<IconMenu key="0" icon="more_vert" position="bottomRight" menuRipple onClick={this.stopPropagation}>
                <MenuItem value="make_admin" icon="account_balance" caption={t('button_makeAdmin')} onClick={this.makeAdmin} />
                <MenuItem value="delete" icon="delete" caption={t('button_delete')} onClick={this.deleteParticipant} />
            </IconMenu>);

            adminMenu.push(<IconMenu key="0" icon="more_vert" position="bottomRight" menuRipple onClick={this.stopPropagation}>
                <MenuItem value="demote_admin" icon="cancel" caption={t('button_demoteAdmin')} onClick={this.demoteAdmin} />
                <MenuItem value="delete" icon="delete" caption={t('button_delete')} onClick={this.deleteParticipant} />
            </IconMenu>);

            inviteMenu.push(<IconMenu key="0" icon="more_vert" position="bottomRight" menuRipple onClick={this.stopPropagation}>
                <MenuItem value="delete" icon="delete" caption={t('button_delete')} onClick={this.deleteParticipant} />
                <MenuItem value="delete" icon="delete" caption={t('button_delete')} onClick={this.deleteInvite} />
            </IconMenu>);
        }

        return (
            <div className={css('chat-sidebar', { open: this.props.open })}>
                <div className="title">{t('title_About')}</div>
                <div className="flex-row flex-shrink-0">
                    <ChatNameEditor showLabel tabIndex="-1" />
                </div>
                {isChannel ?
                    <div className="section-list flex-shrink-0">
                        <List selectable>
                            {canILeave ?
                                <ListItem
                                    disabled={chatStore.hidingChat}
                                    leftIcon="remove_circle_outline"
                                    caption={t('button_leaveChannel')}
                                    onClick={this.leaveChannel}
                                /> : null
                            }

                            {canIAdmin ?
                                <ListItem className="admin-controls"
                                    leftIcon="delete"
                                    caption="button_deleteChannel"
                                    onClick={this.deleteChannel} />
                                : null
                            }
                        </List>
                    </div>
                    : null
                }
                <div className={`list-header clickable ${banishHeader}`} onClick={this.toggleList}>
                    <div style={{ marginRight: 'auto' }}>{t('title_Members')}</div>
                    <FontIcon
                        value={this.listClosed ? 'arrow_drop_down' : 'arrow_drop_up'} />
                </div>
                <div className={css('section-list', { closed: this.listClosed })}>
                    <List>
                        {chat.participants ?
                            chat.participants.map(c =>
                                (<span data-username={c.username} key={c.username}>
                                    <ListItem className={c.username}
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
                                </span>)
                            ) : null}
                        {invited && invited.length ? <ListSubHeader caption={t('title_invited')} /> : null}
                        {invited ? invited.map(i =>
                            (<span data-username={i.username} key={`invited--${i.username}`}>
                                <ListItem
                                    caption={i.username}
                                    rightActions={inviteMenu}
                                    onClick={this.openContact}
                                />
                            </span>))
                            : null}
                        {isChannel && canIAdmin ?
                            <ListItem
                                className="admin-controls"
                                caption="button_inviteToChannel"
                                onClick={this.props.onAddParticipants} />
                            : null
                        }
                    </List>
                </div>
            </div>
        );
    }
}

module.exports = ChatSideBar;
