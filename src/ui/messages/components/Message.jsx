const React = require('react');
const Avatar = require('../../shared-components/Avatar');
const { observer } = require('mobx-react');
const { time } = require('../../../helpers/formatter');
const Interweave = require('interweave/lib').default;
const EmojiMatcher = require('interweave/lib/matchers/Emoji').default;
const UrlMatcher = require('interweave/lib/matchers/Url').default;
const EmailMatcher = require('interweave/lib/matchers/Email').default;

const matchers = [
    new EmojiMatcher('emoji', { convertShortName: true, convertUnicode: true, enlargeUpTo: 2 }),
    new UrlMatcher('url'),
    new EmailMatcher('email')
];

const emojiPath = '../node_modules/emojione/assets/png/{{hexcode}}.png';

@observer
class Message extends React.Component {
    // isJumboji = false;

    afterParse = (arr) => {
        // if (this.isJumboji) return arr;
        // if (arr.length > 10) return arr;
        // for (let i = 0; i < arr.length; i++) {
        //     if (!arr[i].type || arr[0].type.name !== 'Emoji') {
        //         return arr;
        //     }
        // }
        // this.isJumboji = true;
        // setTimeout(this.forceUpdate.bind(this));
        return arr;
    };

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
                                onAfterParse={this.afterParse} matchers={matchers}
                                emojiPath={emojiPath} />
                </div>
                {this.props.message.sending ? <div className="sending-overlay" /> : null}
            </div>
        );
    }
}

module.exports = Message;
