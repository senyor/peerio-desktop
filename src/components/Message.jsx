const React = require('react');
const { Avatar } = require('react-toolbox');
const { observer } = require('mobx-react');

const Message = observer(props => {
    return (
        <div className="message-content-wrapper">
            <Avatar>
                <img src="https://placeimg.com/80/80/animals" alt="avatar" />
            </Avatar>
            <div className="message-content">
                <div className="meta-data">
                    <div className="user">{props.username}</div>
                    <div className="timestamp">{new Date(props.timestamp).toLocaleString()}</div>
                </div>
                <p>{props.text}</p>
            </div>
        </div>
    );
});

module.exports = Message;
