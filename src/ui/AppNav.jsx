const React = require('react');
const { withRouter } = require('react-router');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton } = require('react-toolbox');
const {User, contactStore, chatStore} = require('../icebear');//eslint-disable-line
const Avatar = require('./shared_components/Avatar');
const css = require('classnames');
const app = require('electron').remote.app;

@observer
class AppNav extends React.Component {

    @observable inMessages = true;

    componentWillMount() {
        this.contact = contactStore.getContact(User.current.username);
        autorunAsync(() => app.setBadgeCount(chatStore.unreadMessages), 250);
    }

    toMessages = () => {
        this.props.router.push('/app');
        this.inMessages = !this.inMessages;
    };

    toFiles = () => {
        this.props.router.push('/app/files');
        this.inMessages = !this.inMessages;
    };

    unreadFiles = () => {
        return true;
    };

    render() {
        return (
            <div className="app-nav">
                <Avatar contact={this.contact} />
                <div className="app-menu">
                    <div className={css('menu-item', { active: this.inMessages })}>
                        <IconButton icon="forum" onClick={this.toMessages} />
                        <div className={chatStore.unreadMessages > 0 ? 'look-at-me' : ''} />
                    </div>

                    <div className={css('menu-item', { active: !this.inMessages })} >
                        <IconButton icon="folder" onClick={this.toFiles} />
                        <div className={this.unreadFiles ? 'look-at-me' : ''} />
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
