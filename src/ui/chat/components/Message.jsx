/* eslint-disable react/no-danger,react/no-array-index-key */
const React = require('react');
const { observer } = require('mobx-react');
const css = require('classnames');
const { t } = require('peerio-translator');
const { systemMessages } = require('~/icebear');

const { Button, FontIcon, IconMenu, MenuItem } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { time } = require('~/helpers/formatter');
const { processMessageForDisplay } = require('~/helpers/process-message-for-display');
const urls = require('~/config').translator.urlMap;
const uiStore = require('~/stores/ui-store');

const InlineFiles = require('./InlineFiles');
const UrlPreview = require('./UrlPreview');


// HACK: make this as a proper react component
window.openContact = (username) => {
    uiStore.contactDialogUsername = username;
};


/**
 * IMPORTANT:
 * MessageList.jsx scroll retention logic relies on root element of this component to have
 * class name 'message-content-wrapper' at the first position in class list
 */
@observer
class Message extends React.Component {
    renderSystemData(m) {
        // !! SECURITY: sanitize if you move this to something that renders dangerouslySetInnerHTML
        if (!m.systemData) return null;
        return <p className="system-message selectable">{systemMessages.getSystemMessageText(m)}</p>;
    }
    render() {
        /*
            props: {
                /// the active chat, as defined in icebear's chatStore singleton (chatStore.activeChat)
                /// peerio-icebear/src/models/chats/chat.js
                chat
                /// the message proper
                /// peerio-icebear/src/models/chats/message.js
                message
                /// the message.groupWithPrevious field (bool)
                light
                /// callback injected by MessageList, to ensure we stick to the bottom of the chat view.
                onImageLoaded
            }
        */
        const m = this.props.message;
        // console.log('Rendering message ', m.tempId || m.id);
        const invalidSign = m.signatureError === true;

        return (
            <div className={
                css('message-content-wrapper', {
                    'invalid-sign': invalidSign, 'send-error': m.sendError, light: this.props.light
                })}>
                <div className="message-content-wrapper-inner">
                    {this.props.light
                        ? <div className="timestamp">{time.format(m.timestamp).split(' ')[0]}</div>
                        : <Avatar contact={m.sender} size="medium" />}
                    <div className="message-content">
                        {
                            this.props.light
                                ? null
                                : <div className="meta-data">
                                    <div className="user selectable">
                                        {m.sender.fullName}&nbsp;
                                        <span className="username selectable">
                                            {m.sender.username}
                                        </span>
                                    </div>
                                    <div className="timestamp selectable">{time.format(m.timestamp)}</div>
                                </div>
                        }
                        <div className="message-body">
                            {
                                m.systemData || m.files
                                    ? null
                                    : <p dangerouslySetInnerHTML={processMessageForDisplay(m)} className="selectable" />
                            }
                            {m.files && m.files.length
                                ? <InlineFiles
                                    files={m.files}
                                    onDelete={() => {
                                        console.log('delete');
                                        this.props.chat.removeMessage(m);
                                    }}
                                    onImageLoaded={this.props.onImageLoaded} />
                                : null
                            }
                            {
                                /* SECURITY: sanitize if you change this to  render in dangerouslySetInnerHTML */
                                this.renderSystemData(m)
                            }
                            {m.hasUrls
                                ? m.externalImages.map(
                                    (urlData, ind) =>
                                        (<UrlPreview key={ind} urlData={urlData}
                                            onImageLoaded={this.props.onImageLoaded} />)
                                )
                                : null}
                        </div>
                        {/* m.inlineImages.map(url => (
                            <img key={url} className="inline-image" onLoad={this.props.onImageLoaded} src={url} />)) */}
                        {m.sendError ?
                            <div className="send-error-container">
                                <div className="send-error-menu">
                                    <IconMenu icon="error" position="topLeft" menuRipple>
                                        <MenuItem value={t('button_retry')}
                                            caption={t('button_retry')}
                                            onClick={() => m.send()} />
                                        <MenuItem value={t('button_delete')}
                                            caption={t('button_delete')}
                                            onClick={() => this.props.chat.removeMessage(m)} />
                                    </IconMenu>
                                </div>
                                <div className="send-error-message">{t('error_messageSendFail')}</div>
                            </div>
                            : null
                        }
                    </div>
                    {invalidSign ? <FontIcon value="error_outline_circle" className="warning-icon" /> : null}
                    {m.receipts ?
                        <div key={`${m.tempId || m.id}receipts`} className="receipt-wrapper">
                            {m.receipts.map(r => {
                                return r.receipt.signatureError ? null
                                    : <Avatar key={r.username} username={r.username} size="tiny" />;
                            })}
                        </div> : null}

                </div>
                {invalidSign ?
                    <div className="invalid-sign-warning">
                        <div className="content">{t('error_invalidMessageSignature')}</div>
                        <Button href={urls.msgSignature} label={t('title_readMore')} flat primary />
                    </div>
                    : null
                }

                {m.sending ? <div className="sending-overlay" /> : null}
            </div>
        );
    }
}

module.exports = Message;
