/* eslint-disable react/no-danger */
const React = require('react');
const Avatar = require('~/ui/shared-components/Avatar');
const { observer } = require('mobx-react');
const { time } = require('~/helpers/formatter');
const { sanitizeChatMessage } = require('~/helpers/sanitizer');
const emojione = require('~/static/emoji/emojione.js');
const Autolinker = require('autolinker');
const InlineFiles = require('./InlineFiles');
const css = require('classnames');
const { t } = require('peerio-translator');
const config = require('~/config');
const { Button, FontIcon } = require('~/react-toolbox');

const autolinker = new Autolinker({
    urls: {
        schemeMatches: true,
        wwwMatches: true,
        tldMatches: true
    },
    email: true,
    phone: true,
    mention: false,
    hashtag: false,
    stripPrefix: false,
    newWindow: false,
    truncate: 0,
    className: '',
    stripTrailingSlash: false
});

function processMessage(msg) {
    if (msg.processedText != null) return msg.processedText;
    // removes all html except whitelisted
    // closes unclosed tags
    let str = sanitizeChatMessage(msg.text);
    str = emojione.unicodeToImage(str);
    str = autolinker.link(str);
    str = { __html: str };
    msg.processedText = str;
    return str;
}

@observer
class Message extends React.Component {
    render() {
        const m = this.props.message;
        return (
            <div>
                <div className={css('message-content-wrapper', { 'invalid-sign': !m.isSignValid })}>
                    {m.isSignValid ? null : <FontIcon value="warning" className="warning-icon" />}
                    <Avatar contact={m.sender} />
                    <div className="message-content">
                        <div className="meta-data">
                            <div className="user">{m.sender.username}</div>
                            <div className="timestamp">{time.format(m.timestamp)}</div>
                        </div>
                        <p dangerouslySetInnerHTML={processMessage(m)} />
                        {m.files ? <InlineFiles files={m.files} /> : null}
                    </div>
                    {m.sending ? <div className="sending-overlay" /> : null}
                </div>
                {m.isSignValid ? null :
                    <div className="invalid-sign-warning">
                        {t('invalidSignWarning')}
                        <Button href={config.supportUrl} label={t('readMore')} flat primary />
                    </div>
                }
            </div>
        );
    }
}

module.exports = Message;
