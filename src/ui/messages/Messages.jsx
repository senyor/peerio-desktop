const React = require('react');
const { observable, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, IconButton, TooltipIconButton } = require('~/react-toolbox');
const ChatList = require('./components/ChatList');
const MessageInput = require('./components/MessageInput');
const MessageList = require('./components/MessageList');
const NoChatSelected = require('./components/NoChatSelected');
const { chatStore, TinyDb } = require('~/icebear');
const sounds = require('~/helpers/sounds');
const UploadInChatProgress = require('./components/UploadInChatProgress');
const { t } = require('peerio-translator');
const css = require('classnames');
const ChatSideBar = require('./components/ChatSideBar');
const ChatNameEditor = require('./components/ChatNameEditor');

const SIDEBAR_STATE_KEY = 'chatSideBarIsOpen';
@observer
class Messages extends React.Component {
    @observable static sidebarOpen = false; // static, so it acts like lazy internal store
    @observable chatNameEditorVisible = false;

    componentWillMount() {
        this.reactionToDispose = reaction(() => Messages.sidebarOpen, open => {
            TinyDb.user.setValue(SIDEBAR_STATE_KEY, open);
        }, { delay: 1000 });
        TinyDb.user.getValue(SIDEBAR_STATE_KEY).then(isOpen => {
            if (isOpen) Messages.sidebarOpen = isOpen;
        });
    }

    componentWillUnmount() {
        this.reactionToDispose();
    }

    sendMessage(m) {
        sounds.sending.play();
        chatStore.activeChat.sendMessage(m)
            .then(() => sounds.sent.play())
            .catch(() => sounds.destroy.play());
    }

    sendAck() {
        sounds.sending.play();
        chatStore.activeChat.sendAck()
            .then(() => sounds.sent.play())
            .catch(() => sounds.destroy.play());
    }

    shareFiles = (files) => {
        sounds.sending.play();
        chatStore.activeChat.shareFiles(files)
            .then(() => sounds.sent.play())
            .catch(() => sounds.destroy.play());
    };

    toggleSidebar = () => {
        Messages.sidebarOpen = !Messages.sidebarOpen;
    };


    showChatNameEditor = () => {
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
                                    onBlur={this.hideChatNameEditor} ref={this.chatNameEditorRef} />
                                : <div className="title-content">
                                    {chat.chatName}
                                    <FontIcon value="edit" />
                                </div>
                        }
                    </div>
                    <div className="flex-row meta-nav">
                        <TooltipIconButton icon={chat.isFavorite ? 'star' : 'star_border'}
                            onClick={chat.toggleFavoriteState}
                            className={css({ starred: chat.isFavorite })}
                            tooltip={t('title_starChannel')}
                            tooltipPosition="bottom"
                            tooltipDelay={500} />
                        <div className="member-count">
                            <TooltipIconButton icon="person"
                                tooltip={t('title_memberCount')}
                                tooltipPosition="bottom"
                                tooltipDelay={500}
                                onClick={this.toggleSidebar} />
                            {chat.participants ? chat.participants.length : ''}
                        </div>

                    </div>
                </div>
                <IconButton icon="chrome_reader_mode" onClick={this.toggleSidebar} />
            </div>
        );
    }
    render() {
        const chat = chatStore.activeChat;

        return (
            <div className="messages">
                <ChatList />
                <div className="message-view">
                    {chat ? this.renderHeader() : null}
                    <div className="flex-row flex-grow-1">
                        <div className="flex-col flex-grow-1">
                            {chatStore.chats.length === 0 && !chatStore.loading ? <NoChatSelected /> : <MessageList />}
                            {chat && chat.uploadQueue.length ? <UploadInChatProgress queue={chat.uploadQueue} /> : null}
                            <MessageInput show={!!chat && chat.metaLoaded}
                                onSend={this.sendMessage} onAck={this.sendAck} onFileShare={this.shareFiles} />
                        </div>
                        {chat ? <ChatSideBar open={Messages.sidebarOpen} /> : null}
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = Messages;
