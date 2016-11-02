const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Avatar, FontIcon, IconButton, IconMenu,
        Input, List, ListItem, ListSubHeader, MenuItem, Panel } = require('react-toolbox');
const Search = require('../components/Search');
const ChatList = require('../components/ChatList');
const MessageInput = require('../components/MessageInput');

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
                        <div className="message">
                            <div className="message-content-wrapper">
                                <Avatar>
                                    <img src="https://placeimg.com/80/80/animals" alt="avatar" />
                                </Avatar>
                                <div className="message-content">
                                    <div className="meta-data">
                                        <div className="user">Bob</div>
                                        <div className="timestamp">8:29 AM</div>
                                    </div>
                                    <p>Message content</p>
                                </div>
                            </div>
                        </div>
                        <MessageInput />
                    </div>
                </div>
            </Panel>
        );
    }
}

module.exports = Messages;
