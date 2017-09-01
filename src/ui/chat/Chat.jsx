const React = require('react');
const { observable, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, IconButton, TooltipIconButton, ProgressBar } = require('~/react-toolbox');
const ChatList = require('./components/ChatList');
const MessageInput = require('./components/MessageInput');
const MessageList = require('./components/MessageList');
const { chatStore, TinyDb, clientApp, crypto, chatInviteStore } = require('~/icebear');
const sounds = require('~/helpers/sounds');
const uiStore = require('~/stores/ui-store');
const UploadInChatProgress = require('./components/UploadInChatProgress');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const css = require('classnames');
const ChatSideBar = require('./components/ChatSideBar');
const ChatNameEditor = require('./components/ChatNameEditor');
const UserPicker = require('~/ui/shared-components/UserPicker');
const routerStore = require('~/stores/router-store');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');

const SIDEBAR_STATE_KEY = 'chatSideBarIsOpen';

const messages = ['title_randomMessage1', 'title_randomMessage2', 'title_randomMessage3', 'title_randomMessage4'];
const randomMessage = messages[crypto.cryptoUtil.getRandomNumber(0, messages.length - 1)];

@observer
class Chat extends React.Component {
    @observable static sidebarOpen = true; // static, so it acts like lazy internal store
    @observable chatNameEditorVisible = false;
    @observable showUserPicker = false;

    static sidebarStateSaver;

    componentWillMount() {
        chatStore.loadAllChats();
        clientApp.isInChatsView = true;
        TinyDb.user.getValue(SIDEBAR_STATE_KEY).then(isOpen => {
            Chat.sidebarOpen = isOpen == null ? Chat.sidebarOpen : isOpen;
        });
        if (!Chat.sidebarStateSaver) {
            Chat.sidebarStateSaver = reaction(() => Chat.sidebarOpen, open => {
                TinyDb.user.setValue(SIDEBAR_STATE_KEY, open);
            }, { delay: 1000 });
        }
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
                .catch(() => Chat.playErrorSound());
        } catch (err) {
            console.error(err);
        }
    }

    sendAck() {
        try {
            chatStore.activeChat.sendAck()
                .catch(() => Chat.playErrorSound());
        } catch (err) {
            console.error(err);
        }
    }

    shareFiles = (files) => {
        try {
            chatStore.activeChat.shareFiles(files)
                .catch(() => Chat.playErrorSound());
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
        Chat.sidebarOpen = !Chat.sidebarOpen;
    };

    showChatNameEditor = () => {
        if (!chatStore.activeChat.canIAdmin) return;
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
            <div className="message-toolbar flex-justify-between">
                <div className="flex-col" style={{ width: '90%' }}>
                    <div className="title" onClick={this.showChatNameEditor}>
                        {
                            this.chatNameEditorVisible
                                ? <ChatNameEditor showLabel={false} className="name-editor"
                                    readOnly={!chat.canIAdmin}
                                    onBlur={this.hideChatNameEditor} ref={this.chatNameEditorRef} />
                                : <div style={{ overflow: 'hidden' }}>
                                    {chat.canIAdmin ? <FontIcon value="edit" /> : null}
                                    <div className="title-content">
                                        {chat.name}
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="flex-row meta-nav">
                        {chat.changingFavState
                            ? <ProgressBar type="circular" mode="indeterminate" />
                            : <TooltipIconButton icon={chat.isFavorite ? 'star' : 'star_border'}
                                onClick={chat.toggleFavoriteState}
                                className={css({ starred: chat.isFavorite })}
                                tooltip={t('title_starChat')}
                                tooltipPosition="bottom"
                                tooltipDelay={500} />
                        }
                        <div className="member-count">
                            <TooltipIconButton icon="person"
                                tooltip={t('title_Members')}
                                tooltipPosition="bottom"
                                tooltipDelay={500}
                                onClick={this.toggleSidebar} />
                            {chat.participants && chat.participants.length ? chat.participants.length : ''}
                        </div>

                    </div>
                </div>
                <IconButton icon="chrome_reader_mode" onClick={this.toggleSidebar} />
            </div>
        );
    }
    render() {
        const chat = chatStore.activeChat;
        if (chatStore.chats.length === 0 && !chatStore.loading && !chatInviteStore.received.length) {
            routerStore.navigateToAsync(routerStore.ROUTES.newChat);
            return null;
        }

        return (
            <div className="messages">
                {chatStore.chats.length + chatInviteStore.received.length > 0 ? <ChatList /> : (
                    chatStore.loading ? <div className="feature-navigation-list" /> : null)}
                <div className="message-view">
                    {chatStore.loading ?
                        <div className="random-messages">
                            <div className="headline"><T k={randomMessage} /></div>
                        </div>
                        : null}
                    {chat ? this.renderHeader() : null}
                    <div className="flex-row flex-grow-1">
                        {
                            this.showUserPicker
                                ? <div className="flex-col flex-grow-1 create-new-chat" style={{ position: 'relative', padding: '0 20px' }}>
                                    <UserPicker onClose={this.closeUserPicker} onAccept={this.addParticipants} title={t('title_addParticipants')} noDeleted />
                                </div>
                                : <div className="flex-col flex-grow-1" style={{ position: 'relative' }}>
                                    {chatStore.chats.length === 0 && !chatStore.loading ? null : <MessageList />}
                                    {chat && chat.uploadQueue.length ? <UploadInChatProgress queue={chat.uploadQueue} /> : null}
                                    <MessageInput readonly={!chat || !chat.metaLoaded || chat.isReadOnly}
                                        placeholder={
                                            chat ?
                                                t('title_messageInputPlaceholder', { chatName: chat.name })
                                                : null
                                        }
                                        onSend={this.sendMessage} onAck={this.sendAck} onFileShare={this.shareFiles} />
                                </div>
                        }
                        {chat ? <ChatSideBar open={Chat.sidebarOpen} onAddParticipants={this.openUserPicker} /> : null}
                    </div>
                    {chat && chat.leaving ? <FullCoverLoader show /> : null}
                </div>
            </div>
        );
    }
}


module.exports = Chat;
