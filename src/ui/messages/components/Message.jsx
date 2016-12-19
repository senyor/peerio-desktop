const React = require('react');
const Avatar = require('../../shared-components/Avatar');
const { observer } = require('mobx-react');
const { time } = require('../../../helpers/formatter');
const Interweave = require('peerio-interweave/lib').default;
const EmojiMatcher = require('peerio-interweave/lib/matchers/Emoji').default;
const UrlMatcher = require('peerio-interweave/lib/matchers/Url').default;
const EmailMatcher = require('peerio-interweave/lib/matchers/Email').default;

const matchers = [
    new EmojiMatcher('emoji', { convertShortName: true, convertUnicode: true, enlargeUpTo: 10 }),
    new UrlMatcher('url'),
    new EmailMatcher('email')
];

const emojiPath = './static/emoji/png/{{hexcode}}.png';

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
                    <Interweave tagName="p" content={this.props.message.text} noHtml
                                matchers={matchers} emojiPath={emojiPath} />
                </div>
                {this.props.message.sending ? <div className="sending-overlay" /> : null}
            </div>
        );
    }
}

module.exports = Message;
