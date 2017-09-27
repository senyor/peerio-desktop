const React = require('react');
const { observer } = require('mobx-react');
const { List, ListItem } = require('~/react-toolbox');
const { chatStore } = require('~/icebear');
const { t } = require('peerio-translator');
const css = require('classnames');
const ChatNameEditor = require('~/ui/chat/components/ChatNameEditor');
const T = require('~/ui/shared-components/T');
const MembersSection = require('./MembersSection');
const FilesSection = require('./FilesSection');

@observer
class ChatSideBar extends React.Component {
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
        const { isChannel, canIAdmin, canILeave } = chat;

        return (
            <div className={css('chat-sidebar', { open: this.props.open })}>
                <div className="title">{t('title_About')}</div>
                <div>
                    <ChatNameEditor showLabel tabIndex="-1" readOnly={!canIAdmin} />
                    {isChannel ? <ChatNameEditor showLabel tabIndex="-1" purpose readOnly={!canIAdmin} /> : null}
                </div>
                {isChannel ?
                    <div className="sidebar-section">
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
                                <ListItem className="admin-controls delete-room"
                                    leftIcon="delete"
                                    caption={t('button_deleteChannel')}
                                    onClick={this.deleteChannel} />
                                : null
                            }
                        </List>
                    </div>
                    : null
                }
                <MembersSection onAddParticipants={this.props.onAddParticipants} />
                <FilesSection />
            </div>
        );
    }
}

module.exports = ChatSideBar;
