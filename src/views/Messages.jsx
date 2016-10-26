const React = require('react');
const { Component } = require('react');
const { Layout, Panel, Avatar, FontIcon, IconButton, Input, List, ListItem, ListSubHeader } = require('react-toolbox');

class Messages extends Component {
    render() {
        return (
            <Layout className="rt-light-theme">
                {/* TODO: extract app-nav to own view? maybe App.jsx? */}
                <div className="app-nav">
                    <Avatar>
                        <img src="https://placeimg.com/80/80/animals" alt="avatar" />
                    </Avatar>
                    <div className="app-menu">
                        <div className="menu-item active">
                            <IconButton icon="forum" />
                        </div>
                        <div className="menu-item">
                            <IconButton icon="folder" />
                        </div>

                        <div className="menu-item settings">
                            <IconButton icon="settings" />
                        </div>
                    </div>
                </div>
                <Panel>
                    <div className="messages" >
                        <div className="message-list">
                            {/* Not sure that we should use the react-toolbox list items.
                                the ones we have are more custom than what these seem to allow. */}
                            <List>
                                <ListSubHeader caption="Direct messages" />
                                <ListItem caption="Alice" className="online active" />
                                <ListItem caption="Albert" />
                                <ListItem caption="Bob" />
                                <ListItem caption="Jeff" />
                                <ListItem caption="Steve" />
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
                            <div className="message-input">
                                <IconButton icon="add_circle_outline" />
                                <Input multiline type="text" placeholder="Messages Alice" />
                            </div>
                        </div>
                    </div>
                </Panel>
            </Layout>
        );
    }
}

module.exports = Messages;
