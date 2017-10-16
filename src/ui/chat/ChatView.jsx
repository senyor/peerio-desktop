const React = require('react');
const { observable, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, IconButton, TooltipIconButton, ProgressBar } = require('~/react-toolbox');
const MessageInput = require('./components/MessageInput');
const MessageList = require('./components/MessageList');
const { chatStore, clientApp, crypto } = require('~/icebear');
const sounds = require('~/helpers/sounds');
const uiStore = require('~/stores/ui-store');
const UploadInChatProgress = require('./components/UploadInChatProgress');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const css = require('classnames');
const ChatSideBar = require('./components/sidebar/ChatSideBar');
const ChannelSideBar = require('./components/sidebar/ChannelSideBar');
const ChatNameEditor = require('./components/ChatNameEditor');
const NoChatSelected = require('./components/NoChatSelected');
const UserPicker = require('~/ui/shared-components/UserPicker');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');

const messages = ['title_randomMessage1', 'title_randomMessage2', 'title_randomMessage3', 'title_randomMessage4'];
const randomMessage = messages[crypto.cryptoUtil.getRandomNumber(0, messages.length - 1)];

@observer
class ChatView extends React.Component {
    @observable chatNameEditorVisible = false;
    @observable showUserPicker = false;

    componentWillMount() {
        clientApp.isInChatsView = true;
        this.reactionsToDispose = [
            reaction(() => this.showUserPicker, show => { clientApp.isInChatsView = !show; })
        ];
    }

    componentWillUnmount() {
        clientApp.isInChatsView = false;
        this.reactionsToDispose.forEach(dispose => dispose());
    }

    sendMessage(m) {
        try {
            chatStore.activeChat.sendMessage(m)
                .catch(() => ChatView.playErrorSound());
        } catch (err) {
            console.error(err);
        }
    }

    sendAck() {
        try {
            chatStore.activeChat.sendAck()
                .catch(() => ChatView.playErrorSound());
        } catch (err) {
            console.error(err);
        }
    }

    shareFiles = (files) => {
        try {
            chatStore.activeChat.shareFiles(files)
                .catch(() => ChatView.playErrorSound());
        } catch (err) {
            console.error(err);
        }
    };

    addParticipants = (contacts) => {
        chatStore.activeChat.addParticipants(contacts);
        this.closeUserPicker();
    };

    static playErrorSound() {
        if (uiStore.prefs.errorSoundsEnabled) sounds.destroy.play();
    }

    openUserPicker = () => {
        this.showUserPicker = true;
    };

    closeUserPicker = () => {
        this.showUserPicker = false;
    };

    toggleSidebar = () => {
        uiStore.prefs.chatSideBarIsOpen = !uiStore.prefs.chatSideBarIsOpen;
    };

    showChatNameEditor = () => {
        if (!(chatStore.activeChat.canIAdmin && chatStore.activeChat.isChannel)) return;
        this.chatNameEditorVisible = true;
    };

    hideChatNameEditor = () => {
        this.chatNameEditorVisible = false;
    };

    chatNameEditorRef = ref => {
        if (ref) ref.nameInput.focus();
    };

    // assumes active chat exists, don't render if it doesn't
    renderHeader() {
        const chat = chatStore.activeChat;
        return (
            <div className="message-toolbar">
                <div className="message-toolbar-inner" >
                    <div className="title" onClick={this.showChatNameEditor}>
                        {
                            this.chatNameEditorVisible
                                ? <ChatNameEditor showLabel={false} className="name-editor"
                                    readOnly={!chat.canIAdmin}
                                    onBlur={this.hideChatNameEditor} ref={this.chatNameEditorRef} />
                                : <div className="name-editor-inner">
                                    {chat.canIAdmin && chat.isChannel ? <FontIcon value="edit" /> : null}
                                    <div className="title-content">
                                        {chat.name}
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="meta-nav">
                        {chat.isChannel
                            ? <div className="member-count">
                                <TooltipIconButton icon="person"
                                    tooltip={t('title_Members')}
                                    tooltipPosition="bottom"
                                    tooltipDelay={500}
                                    onClick={this.toggleSidebar} />
                                {chat.participants && chat.participants.length ? chat.participants.length : ''}
                            </div>
                            : (chat.changingFavState
                                ? <ProgressBar type="circular" mode="indeterminate" />
                                : <TooltipIconButton icon={chat.isFavorite ? 'star' : 'star_border'}
                                    onClick={chat.toggleFavoriteState}
                                    className={css({ starred: chat.isFavorite })}
                                    tooltip={t('title_starChat')}
                                    tooltipPosition="bottom"
                                    tooltipDelay={500} />
                            )
                        }
                    </div>
                </div>
                {
                    chat.isChannel || chat.recentFiles.length
                        ? <IconButton icon="chrome_reader_mode" onClick={this.toggleSidebar} />
                        : null
                }
            </div>
        );
    }

    get sidebar() {
        if (!chatStore.activeChat) return null;
        return chatStore.activeChat.isChannel ?
            <ChannelSideBar open={uiStore.prefs.chatSideBarIsOpen} onAddParticipants={this.openUserPicker} /> :
            <ChatSideBar open={uiStore.prefs.chatSideBarIsOpen} />;
    }

    render() {
        const chat = chatStore.activeChat;
        if (!chat) return <NoChatSelected />;
        return (
            <div className="message-view">
                {chatStore.loading ?
                    <div className="random-messages">
                        <div className="headline"><T k={randomMessage} /></div>
                    </div>
                    : null}
                {this.renderHeader()}
                <div className="messages-and-sidebar-container">
                    {
                        this.showUserPicker
                            ? <div className="create-new-chat">
                                <UserPicker onClose={this.closeUserPicker} onAccept={this.addParticipants}
                                    exceptContacts={chat.participants}
                                    title={t('title_addParticipants')} noDeleted />
                            </div>
                            : <div className="messages-container">
                                {chatStore.chats.length === 0 && !chatStore.loading ? null : <MessageList />}
                                {
                                    chat && chat.uploadQueue.length
                                        ? <UploadInChatProgress queue={chat.uploadQueue} />
                                        : null
                                }
                                <MessageInput
                                    readonly={!chat || !chat.metaLoaded || chat.isReadOnly}
                                    placeholder={
                                        chat
                                            ? t(
                                                'title_messageInputPlaceholder',
                                                { chatName: `${chat.isChannel ? '# ' : ''}${chat.name}` })
                                            : null
                                    }
                                    onSend={this.sendMessage}
                                    onAck={this.sendAck}
                                    onFileShare={this.shareFiles}
                                />
                            </div>
                    }
                    {this.sidebar}
                </div>
                {chat.leaving ? <FullCoverLoader show /> : null}
            </div>
        );
    }
}


module.exports = ChatView;
