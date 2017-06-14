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
        const banishHeader = chatStore.activeChat.participants && chatStore.activeChat.participants.length
            ? '' : 'banish';
        return (
            <div className={css('chat-sidebar', { open: this.props.open })}>
                <div className="title">{t('title_About')}</div>
                <div className="flex-row flex-shrink-0">
                    <ChatNameEditor showLabel tabIndex="-1" />
                </div>
                {/* Commenting out for now. Current state of functionality is confusing users.
                  <List selectable>
                    <ListItem
                        disabled={chatStore.hidingChat}
                        leftIcon="remove_circle_outline"
                        caption={t('button_hideChat')}
                        onClick={chatStore.activeChat.hide}
                    />
                    <ListItem
                      leftIcon="notifications_none"
                      caption="button_muteChat" />
                  </List>
                */}
                <div className={`rt-list-subheader ${banishHeader}`}>{t('title_Members')} </div>
                <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
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
                    </List>
                </div>
            </div>
        );
    }
}

module.exports = ChatSideBar;
