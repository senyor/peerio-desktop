/* eslint-disable react/no-multi-comp */
const React = require('react');
const { reaction } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton, ProgressBar } = require('react-toolbox');
const Search = require('../shared-components/Search');
const ChatList = require('./components/ChatList');
const MessageInput = require('./components/MessageInput');
const Message = require('./components/Message');
const {chatStore} = require('../../icebear');// eslint-disable-line

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
        chatStore.activeChat.sendMessage(m);
    }

    render() {
        return (
            <div className="flex-row">
                <div className="messages">
                    <ChatList />
                    <div className="message-view">
                        <div className="message-toolbar">
                            <div className="title">{chatStore.activeChat && chatStore.activeChat.chatName}</div>
                            <Search />
                            <IconButton icon="info_outline" />
                        </div>
                        {chatStore.activeChat ? <MessageList /> : <NoChatSelected />}
                        <MessageInput show={!!chatStore.activeChat} onSend={this.sendMessage} />
                    </div>
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
        el.scrollTop = el.scrollHeight;
    }
    render() {
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
        <div className="flex-col" style={{ alignSelf: 'center', justifyContent: 'center', height: '100vh' }}>
            Welcome? Some images? Select chat there?
        </div>
    );
}

module.exports = Messages;
