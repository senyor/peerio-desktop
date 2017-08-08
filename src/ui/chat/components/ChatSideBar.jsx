const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, List, ListItem, TooltipIconButton, ListSubHeader } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore, contactStore, chatInviteStore } = require('~/icebear');
const { t } = require('peerio-translator');
const css = require('classnames');
const ChatNameEditor = require('./ChatNameEditor');
const { getAttributeInParentChain } = require('~/helpers/dom');

@observer
class ChatSideBar extends React.Component {
    @observable listClosed = false;
    startChat(ev) {
        const username = getAttributeInParentChain(ev.target, 'data-id');
        chatStore.startChat([contactStore.getContact(username)]);
    }

    toggleList = () => {
        this.listClosed = !this.listClosed;
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

    render() {
        const chat = chatStore.activeChat;
        if (!chat) return null;
        const { isChannel, canIAdmin } = chat;

        const invited = chatInviteStore.sent.get(chat.id);

        const banishHeader = chat.participants && chat.participants.length ? '' : 'banish';

        return (
            <div className={css('chat-sidebar', { open: this.props.open })}>
                <div className="title">{t('title_About')}</div>
                <div className="flex-row flex-shrink-0">
                    <ChatNameEditor showLabel tabIndex="-1" />
                </div>
                {isChannel ?
                    <div className="section-list flex-shrink-0">
                        <List selectable>
                            <ListItem
                                disabled={chatStore.hidingChat}
                                leftIcon="remove_circle_outline"
                                caption={t('button_leaveChannel')}
                                onClick={this.leaveChannel}
                            />

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
                                (<ListItem key={c.username}
                                    leftActions={[<Avatar key="a" contact={c} size="small" />]}
                                    caption={c.username}
                                    legend={c.fullName}
                                // rightIcon={c.isDeleted ? null : <TooltipIconButton data-id={c.username} icon="forum"
                                //     tooltip={t('title_haveAChat')} onClick={this.startChat} />}
                                // onClick={() => chatStore.startChat([c])}
                                />)
                            ) : null}
                        {invited && invited.length ? <ListSubHeader caption={t('title_invited')} /> : null}
                        {invited ? invited.map(i => <ListItem key={`invited--${i.username}`} caption={i.username} />) : null}
                        {isChannel && canIAdmin ?
                            <ListItem
                                className="admin-controls"
                                caption="button_inviteToChannel" />
                            : null
                        }
                    </List>
                </div>
            </div>
        );
    }
}

module.exports = ChatSideBar;
