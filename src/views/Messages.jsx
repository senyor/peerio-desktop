const React = require('react');
const { observable, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton } = require('react-toolbox');
const Search = require('../components/Search');
const ChatList = require('../components/ChatList');
const MessageInput = require('../components/MessageInput');
const Message = require('../components/Message');
const {chatStore} = require('../icebear');// eslint-disable-line

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
                            <div className="title">Alice</div>
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


const MessageList = observer(() => {
    return (
        <div className="messages-container">
            {chatStore.activeChat.messages.map(m =>
                <Message key={m.id || m.tempId} message={m} />
            )}
        </div>
    );
});

function NoChatSelected() {
    return (
        <div className="flex-col" style={{ alignSelf: 'center', justifyContent: 'center', height: '100vh' }}>
            Welcome? Some images? Select chat there?
        </div>
    );
}

module.exports = Messages;
