const React = require('react');
const { observable } = require('mobx');
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
    // Switching between textarea and static text is not really needed, we could always use textarea
    // but there's some bug with chrome or react-toolbox that shifts
    // entire view up a bit if textarea renders on app start
    @observable chatPurposeEditorVisible = false;
    @observable openSectionIndex = 0;

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

    showChatPurposeEditor = () => {
        if (!chatStore.activeChat.canIAdmin) return;
        this.chatPurposeEditorVisible = true;
    }
    hideChatPurposeEditor = () => {
        this.chatPurposeEditorVisible = false;
    }
    chatPurposeEditorRef = ref => {
        if (ref) ref.nameInput.focus();
    };

    // todo: this needs to be made smarter when we have at least one more section
    onMembersToggle = () => {
        this.openSectionIndex = this.openSectionIndex === 0 ? 1 : 0;
    };
    onFilesToggle = () => {
        this.openSectionIndex = this.openSectionIndex === 1 ? 0 : 1;
    };

    render() {
        const chat = chatStore.activeChat;
        if (!chat) return null;
        const { isChannel, canIAdmin, canILeave } = chat;
        if (!isChannel && !chat.recentFiles.length) return null;

        return (
            <div className={css('chat-sidebar', { open: this.props.open })}>
                {isChannel ?
                    <div>
                        <div className="title">{t('title_About')}</div>
                        <div>
                            <ChatNameEditor showLabel tabIndex="-1" readOnly={!canIAdmin} />
                            <div onClick={this.showChatPurposeEditor}>
                                {
                                    this.chatPurposeEditorVisible
                                        ? <ChatNameEditor showLabel tabIndex="-1" purpose readOnly={!canIAdmin}
                                            onBlur={this.hideChatPurposeEditor} multiline
                                            ref={this.chatPurposeEditorRef} />
                                        : <div className="purpose-container">
                                            {chat.chatHead && chat.chatHead.purpose
                                                ? [<T tag="div" k="title_purpose" className="purpose-label" key="1" />,
                                                    <div key="2" className="purpose-text">{chat.chatHead.purpose}</div>]
                                                : <T tag="div" k="title_purpose" className="purpose-label-big" />}
                                        </div>
                                }
                            </div>
                        </div>
                    </div> : null
                }
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
                {isChannel
                    ? <MembersSection onAddParticipants={this.props.onAddParticipants}
                        onToggle={this.onMembersToggle} open={this.openSectionIndex === 0} />
                    : null}
                <FilesSection onToggle={this.onFilesToggle} open={this.openSectionIndex === 1} />
            </div>
        );
    }
}

module.exports = ChatSideBar;
