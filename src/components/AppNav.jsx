const React = require('react');
const { observer } = require('mobx-react');
const { IconButton } = require('react-toolbox');
const {User, contactStore, chatStore} = require('../icebear');//eslint-disable-line
const Avatar = require('./Avatar');

@observer
class AppNav extends React.Component {
    componentWillMount() {
        this.contact = contactStore.getContact(User.current.username);
    }
    render() {
        return (
            <div className="app-nav">
              <Avatar contact={this.contact} />
              <div className="app-menu">
                <div className="menu-item active">
                  <IconButton icon="forum" />
                  <div className={chatStore.unreadMessages > 0 ? 'look-at-me': ''} />
                </div>
                <div className="menu-item" disabled >
                  <IconButton icon="folder" />
                </div>

                <div className="menu-item settings" disabled >
                        <IconButton icon="settings" />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = AppNav;
