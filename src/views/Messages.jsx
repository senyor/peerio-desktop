/* eslint-disable */
const React = require('react');
const { Component } = require('react');
const { Avatar, FontIcon, IconButton,
        Input, List, ListItem, ListSubHeader, Panel } = require('react-toolbox');

class Messages extends Component {
    state = { multiline: '' };


    handleChange = (name, value) => {
        this.setState({ ...this.state, [name]: value });
    };


    render() {
        return (
            <Panel>
                <div className="messages">
                    <div className="message-list">
                        <List selectable ripple>
                            <ListSubHeader caption="Direct messages" />
                            <ListItem caption="Alice" className="online active" leftIcon="fiber_manual_record" />
                            <ListItem caption="Albert" leftIcon="fiber_manual_record" />
                            <ListItem caption="Bill" className="online" leftIcon="fiber_manual_record"
                                rightIcon={<div className="notification">12</div>} />
                            <ListItem caption="Jeff" className="online" leftIcon="fiber_manual_record" />
                            <ListItem caption="Steve" className="busy" leftIcon="fiber_manual_record" />
                        </List>
                    </div>
                    <div className="message-view">
                        <div className="message-toolbar">
                            <div className="title">Alice</div>
                            {/* TODO create Search component */}
                            <div className="search">
                                <FontIcon value="search" className="search-icon" />
                                <Input placeholder="search" />
                                {/* FIXME: Should only be visible when input has focus */}
                                <IconButton icon="highlight_off" />
                            </div>
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
                            <IconButton icon="add_circle_outline" />
                            <Input multiline type="text" placeholder="Messages Alice"
                                onChange={this.handleChange.bind(this, 'multiline')} />
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
