const React = require('react');
const { observer } = require('mobx-react');
const { List, ListItem, TooltipIconButton } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore, contactStore } = require('~/icebear');
const { t } = require('peerio-translator');
const css = require('classnames');
const ChatNameEditor = require('./ChatNameEditor');
const { getAttributeInParentChain } = require('~/helpers/dom');

@observer
class ChatSideBar extends React.Component {
    startChat(ev) {
        const username = getAttributeInParentChain(ev.target, 'data-id');
        chatStore.startChat([contactStore.getContact(username)]);
    }

    render() {
        const isChannel = true;
        const userIsAdmin = true;
        const banishHeader = chatStore.activeChat.participants && chatStore.activeChat.participants.length
            ? '' : 'banish';
        return (
            <div className={css('chat-sidebar', { open: this.props.open })}>
                <div className="title">{t('title_About')}</div>
                <div className="flex-row flex-shrink-0">
                    <ChatNameEditor showLabel tabIndex="-1" />
                </div>
                { isChannel ?
                    <List selectable>
                        <ListItem
                            disabled={chatStore.hidingChat}
                            leftIcon="remove_circle_outline"
                            caption={t('button_leaveChannel')}
                            onClick={chatStore.activeChat.hide}
                        />
                        <ListItem
                          leftIcon="notifications_none"
                          caption="button_muteChannel" />

                        { userIsAdmin ?
                            <ListItem className="admin-controls"
                              leftIcon="delete"
                              caption="button_deleteChannel" />
                            : null
                        }
                    </List>
                  : null
                }
                <div className={`rt-list-subheader ${banishHeader}`}>{t('title_Members')} </div>
                <div className="section-list">
                    <List>
                        {chatStore.activeChat && chatStore.activeChat.participants ?
                            chatStore.activeChat.participants.map(c =>
                                (<ListItem key={c.username}
                                    leftActions={[<Avatar key="a" contact={c} size="small" />]}
                                    caption={c.username}
                                    legend={c.fullName}
                                    rightIcon={c.isDeleted ? null : <TooltipIconButton data-id={c.username} icon="forum"
                                        tooltip={t('title_haveAChat')} onClick={this.startChat} />}
                                    onClick={() => chatStore.startChat([c])} />)
                            ) : null}
                        { isChannel && userIsAdmin ?
                            <ListItem
                              leftIcon="add_circle_outline"
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
