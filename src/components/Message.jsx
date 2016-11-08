const React = require('react');
const Avatar = require('./Avatar');
const { observer } = require('mobx-react');
const { time } = require('../helpers/formatter');

const Message = observer(({ message }) => {
    return (
        <div className="message-content-wrapper">
            <Avatar contact={message.sender} />
            <div className="message-content">
                <div className="meta-data">
                    <div className="user">{message.sender.username}</div>
                    <div className="timestamp">{time.format(message.timestamp)}</div>
                </div>
                <p>{message.text}</p>
            </div>
            {message.sending ? <div className="sending-overlay" /> : null}
        </div>
    );
});

module.exports = Message;
