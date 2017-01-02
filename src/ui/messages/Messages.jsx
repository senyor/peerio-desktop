/* eslint-disable react/no-multi-comp, no-nested-ternary */
const React = require('react');
const { reaction } = require('mobx');
const { observer } = require('mobx-react');
const { ProgressBar } = require('react-toolbox');
// const Search = require('../shared-components/Search');
const ChatList = require('./components/ChatList');
const MessageInput = require('./components/MessageInput');
const Message = require('./components/Message');
const { chatStore } = require('~/icebear');
const sounds = require('~/helpers/sounds');

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

    render() {
        return (
            <div className="messages">
                <ChatList />
                <div className="message-view">
                    <div className="message-toolbar">
                        <div className="title">{ chatStore.activeChat && chatStore.activeChat.chatName}</div>
                        {/* <Search />*/}
                        {/* <IconButton icon="info_outline" />*/}
                    </div>
                    {(chatStore.chats.length === 0 && !chatStore.loading)
                        ? <NoChatSelected />
                        : <MessageList />}
                    <MessageInput show={!!chatStore.activeChat} onSend={this.sendMessage}
                                  onAck={this.sendAck} />
                </div>
            </div>
        );
    }
}

@observer
class MessageList extends React.Component {

    componentDidMount() {
        this.scrollToBottom();
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    scrollToBottom() {
        const el = document.getElementsByClassName('messages-container')[0];
        if (!el) return;
        setTimeout(() => { el.scrollTop = el.scrollHeight; });
    }
    render() {
        if (!chatStore.activeChat) return null;
        return (
            <div className="messages-container">
                {chatStore.activeChat.loadingMessages
                    ? <ProgressBar type="circular" mode="indeterminate"
                                   multicolor className="messages-progress-bar" />
                    : chatStore.activeChat.messages.map(m => <Message key={m.id || m.tempId} message={m} />)
                }
            </div>
        );
    }
}

function NoChatSelected() {
    return (
        <div className="flex-row zero-message">
            <div className="flex-col flex-grow-0" style={{ margin: '16px 24px' }}>
                <img src="static/img/message-arrow-up.png" style={{ maxWidth: '200px' }} role="presentation" />
            </div>
            <div className="flex-col flex-grow-0 flex-shrink-0">
                <div className="flex-row flex-justify-center">
                    <div className="display-3">Have a conversation.</div>
                </div>
                <div className="flex-row flex-align-center flex-justify-center" style={{ width: '100%' }}>
                    <img src="static/img/group-chat.png"
                         style={{ maxWidth: '280px', minWidth: '40%' }} role="presentation" />
                    <ul>
                        <li>Direct messages</li>
                        <li>Multi-party chat</li>
                        {/* <li>Channels</li>*/}
                        <li>Share files</li>
                    </ul>
                </div>
            </div>
            <div className="flex-col flex-grow-1" />
        </div>
    );
}

module.exports = Messages;
