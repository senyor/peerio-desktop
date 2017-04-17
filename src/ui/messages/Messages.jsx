const React = require('react');
const { observable, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton, Input, List, ListItem } = require('~/react-toolbox');
const ChatList = require('./components/ChatList');
const MessageInput = require('./components/MessageInput');
const MessageList = require('./components/MessageList');
const NoChatSelected = require('./components/NoChatSelected');
const { chatStore } = require('~/icebear');
const sounds = require('~/helpers/sounds');
const UploadInChatProgress = require('./components/UploadInChatProgress');
const { t } = require('peerio-translator');
const css = require('classnames');

@observer
class Messages extends React.Component {
    @observable sidebarOpen = false;

    componentWillMount() {
        if (chatStore.activeChat) chatStore.activeChat.loadMessages();
        this.loaderDisposer = reaction(() => chatStore.activeChat, () => chatStore.activeChat.loadMessages());
    }
    componentWillUnmount() {
        this.loaderDisposer();
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

    handleSidebar = () => {
        this.sidebarOpen = !this.sidebarOpen;
    }

    render() {
        return (
            <div className="messages">
                <ChatList />
                <div className="message-view">
                    <div className="message-toolbar flex-justify-between">
                        <div className="title">{chatStore.activeChat && chatStore.activeChat.chatName}</div>
                        <IconButton icon="chrome_reader_mode" onClick={this.handleSidebar} />
                    </div>
                    <div className="flex-row flex-grow-1">
                        <div className="flex-col flex-grow-1">
                            {(chatStore.chats.length === 0 && !chatStore.loading)
                                ? <NoChatSelected />
                                : <MessageList />}
                            {chatStore.activeChat && chatStore.activeChat.uploadQueue.length
                                ? <UploadInChatProgress queue={chatStore.activeChat.uploadQueue} />
                                : null}
                            <MessageInput show={!!chatStore.activeChat && chatStore.activeChat.metaLoaded}
                                onSend={this.sendMessage} onAck={this.sendAck} onFileShare={this.shareFiles} />
                        </div>
                        <div className={css('chat-sidebar', { open: this.sidebarOpen })}>
                            <Input value={chatStore.activeChat && chatStore.activeChat.chatName} />
                            <div>{t('title_Members')}</div>
                            <List selectable>
                                <ListItem caption="Person 1" />
                                <ListItem caption="Person 2" />
                                <ListItem caption="Person 2" />
                            </List>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = Messages;
