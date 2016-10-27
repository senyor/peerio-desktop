const React = require('react');
const { Avatar, IconButton } = require('react-toolbox');

class AppNav extends React.Component {
    render() {
        return (
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
        );
    }
}

module.exports = AppNav;
