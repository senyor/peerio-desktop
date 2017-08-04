const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, List, ListItem, TooltipIconButton } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore, contactStore } = require('~/icebear');
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
        if (confirm(t('title_confirmChannelDelete'))) {
            chatStore.activeChat.delete();
        }
    }

    render() {
        const { isChannel, canIAdmin } = chatStore.activeChat;

        const banishHeader = chatStore.activeChat.participants && chatStore.activeChat.participants.length
            ? '' : 'banish';
        return (
            <div className={css('chat-sidebar', { open: this.props.open })}>
                <div className="title">{t('title_About')}</div>
                <div className="flex-row flex-shrink-0">
                    <ChatNameEditor showLabel tabIndex="-1" />
                </div>
                {isChannel ?
                    <div className="section-list">
                        <List selectable>
                            <ListItem
                                disabled={chatStore.hidingChat}
                                leftIcon="remove_circle_outline"
                                caption={t('button_leaveChannel')}
                                onClick={chatStore.activeChat.hide}
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
                <div className={css('section-list', { closed: this.listClosed })}>
                    <List>
                        <div className={`rt-list-subheader clickable ${banishHeader}`} onClick={this.toggleList}>
                            {t('title_Members')}
                            <FontIcon
                                value={this.listClosed ? 'arrow_drop_down' : 'arrow_drop_up'} />
                        </div>
                        {chatStore.activeChat && chatStore.activeChat.participants ?
                            chatStore.activeChat.participants.map(c =>
                                (<ListItem key={c.username}
                                    leftActions={[<Avatar key="a" contact={c} size="small" />]}
                                    caption={c.username}
                                    legend={c.fullName}
                                // rightIcon={c.isDeleted ? null : <TooltipIconButton data-id={c.username} icon="forum"
                                //     tooltip={t('title_haveAChat')} onClick={this.startChat} />}
                                // onClick={() => chatStore.startChat([c])}
                                />)
                            ) : null}
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
