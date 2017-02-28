const React = require('react');
const { reaction } = require('mobx');
const { observer } = require('mobx-react');
const ChatList = require('./components/ChatList');
const MessageInput = require('./components/MessageInput');
const MessageList = require('./components/MessageList');
const NoChatSelected = require('./components/NoChatSelected');
const { chatStore } = require('~/icebear');
const sounds = require('~/helpers/sounds');
const UploadInChatProgress = require('./components/UploadInChatProgress');

@observer
class Messages extends React.Component {
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

    render() {
        return (
            <div className="messages">
                <ChatList />
                <div className="message-view">
                    <div className="message-toolbar">
                        <div className="title">{ chatStore.activeChat && chatStore.activeChat.chatName}</div>
                    </div>
                    {(chatStore.chats.length === 0 && !chatStore.loading)
                        ? <NoChatSelected />
                        : <MessageList />}
                    {chatStore.activeChat && chatStore.activeChat.uploadQueue.length
                        ? <UploadInChatProgress queue={chatStore.activeChat.uploadQueue} />
                        : null}
                    <MessageInput show={!!chatStore.activeChat} onSend={this.sendMessage}
                                  onAck={this.sendAck} onFileShare={this.shareFiles} />
                </div>
            </div>
        );
    }
}


module.exports = Messages;
