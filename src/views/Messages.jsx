const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton, Panel } = require('react-toolbox');
const Search = require('../components/Search');
const ChatList = require('../components/ChatList');
const MessageInput = require('../components/MessageInput');
const Message = require('../components/Message');
@observer
class Messages extends React.Component {

    render() {
        return (
            <Panel>
                <div className="messages">
                    <ChatList />
                    <div className="message-view">
                        <div className="message-toolbar">
                            <div className="title">Alice</div>
                            <Search />
                            <IconButton icon="info_outline" />
                        </div>
                        <div className="messages-container">
                            <Message />
                        </div>

                        <MessageInput />
                    </div>
                </div>
            </Panel>
        );
    }
}

module.exports = Messages;
