const React = require('react');
const Avatar = require('../../shared-components/Avatar');
const { observer } = require('mobx-react');
const { time } = require('../../../helpers/formatter');
const { FontIcon } = require('react-toolbox');
const Interweave = require('interweave').default;

const Message = observer(({ message }) => {
    return (
        <div className="message-content-wrapper">
            <Avatar contact={message.sender} />
            <div className="message-content">
                <div className="meta-data">
                    <div className="user">{message.sender.username}</div>
                    <div className="timestamp">{time.format(message.timestamp)}</div>
                </div>
                {
                        message.isAck
                            ? <p><FontIcon value="thumb_up" className="color-brand" /></p>
                            : <Interweave tagName="p" content={message.text} noHtml />
                    }
            </div>
            {message.sending ? <div className="sending-overlay" /> : null}
        </div>
    );
});

module.exports = Message;
