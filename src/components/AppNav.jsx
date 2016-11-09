const React = require('react');
const { withRouter } = require('react-router');
const { observer } = require('mobx-react');
const { IconButton } = require('react-toolbox');
const {User, contactStore, chatStore} = require('../icebear');//eslint-disable-line
const Avatar = require('./Avatar');

@observer
class AppNav extends React.Component {
    componentWillMount() {
        this.contact = contactStore.getContact(User.current.username);
    }

    toMessages = () => {
        this.props.router.push('/app');
    };

    toFiles = () => {
        this.props.router.push('/app/files');
    };

    render() {
        return (
            <div className="app-nav">
                <Avatar contact={this.contact} />
                <div className="app-menu">
                    {/* TODO:  add active class to active item */}
                    <div className="menu-item active">
                        <IconButton icon="forum" onClick={this.toMessages} />
                        <div style={{}}>{chatStore.unreadMessages}</div>
                    </div>


                    <div className="menu-item" >
                        <IconButton icon="folder" onClick={this.toFiles} />
                    </div>

                    <div className="menu-item settings" disabled >
                        <IconButton icon="settings" />
                    </div>
                </div>
            </div>

        );
    }
}

module.exports = withRouter(AppNav);
