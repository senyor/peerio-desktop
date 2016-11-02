const React = require('react');
const { Avatar } = require('react-toolbox');

class Message extends React.Component {
    render() {
        return (
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
        );
    }
}

module.exports = Message;
