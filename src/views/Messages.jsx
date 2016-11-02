const React = require('react');
const { Component } = require('react');
const { Avatar, FontIcon, IconButton, IconMenu,
        Input, List, ListItem, ListSubHeader, MenuItem, Panel } = require('react-toolbox');
const Search = require('../components/Search');
const ChatList = require('../components/ChatList');
const { observable } = require('mobx');
const { observer } = require('mobx-react');

@observer
class Messages extends Component {

    handleTextChange = (newVal, el) => {
        this.messageInput.refs.wrappedInstance.handleAutoresize();
    };

    setTextareaRef = (input) => {
        this.messageInput = input;
    };


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
                        <div className="message-input">
                            <IconMenu icon="add_circle_outline">
                                <MenuItem value="share" caption="Share from files" />
                                <MenuItem value="upload" caption="Upload to DM" />
                            </IconMenu>
                            <Input multiline type="text" placeholder="Messages Alice"
                                onChange={this.handleTextChange} ref={this.setTextareaRef} />
                            {/* <Checkbox
                                checked
                                label="Send on enter" /> */}
                            <IconButton icon="thumb_up" />
                            {/*
                                depending on how users react to no send button
                                maybe flip between this and thumbs_up?

                                <IconButton icon="send" />
                            */}
                        </div>
                    </div>
                </div>
            </Panel>
        );
    }
}

module.exports = Messages;
