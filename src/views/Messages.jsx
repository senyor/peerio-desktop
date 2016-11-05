const React = require('react');
const { observable, autorun } = require('mobx');
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
        this.loaderDisposer = autorun(() => { chatStore.activeChat && chatStore.activeChat.loadMessages(); });
    }
    componentWillUnmount() {
        this.loaderDisposer();
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
                        <MessageInput show={!!chatStore.activeChat} onSend={(m) => console.log('send: ', m)} />
                    </div>
                </div>
            </div>
        );
    }
}

function MessageList() {
    return (
        <div className="messages-container">
            {chatStore.activeChat.messages.map(m =>
                <Message key={m.id} username={m.sender.username} timestamp={m.timestamp} text={m.text} />
            )}
        </div>
    );
}

function NoChatSelected() {
    return (
        <div className="flex-col" style={{ alignSelf: 'center', justifyContent: 'center', height: '100vh' }}>
            Welcome? Some images? Select chat there?
        </div>
    );
}

module.exports = Messages;
