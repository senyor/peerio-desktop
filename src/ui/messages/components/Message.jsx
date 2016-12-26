const React = require('react');
const Avatar = require('../../shared-components/Avatar');
const { observer } = require('mobx-react');
const { time } = require('../../../helpers/formatter');
const { sanitizeChatMessage } = require('../../../helpers/sanitizer');
const emojione = require('emojione');


function processMessage(msg){
    if(msg.processedText != null) return msg.processedText;
    let str = sanitizeChatMessage(msg.text);
    str = emojione.unicodeToImage(str);
    str = {__html: str};
    msg.processedText = str;
    return str;
}

@observer
class Message extends React.Component {
    render() {
        return (
            <div className="message-content-wrapper">
                <Avatar contact={this.props.message.sender} />
                <div className="message-content">
                    <div className="meta-data">
                        <div className="user">{this.props.message.sender.username}</div>
                        <div className="timestamp">{time.format(this.props.message.timestamp)}</div>
                    </div>
                    <p dangerouslySetInnerHTML={processMessage(this.props.message)} />
                </div>
                {this.props.message.sending ? <div className="sending-overlay" /> : null}
            </div>
        );
    }
}

module.exports = Message;
