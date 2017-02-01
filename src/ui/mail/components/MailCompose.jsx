const React = require('react');
const MailFormatActions = require('./MailFormatActions');
const ComposeInput = require('../../shared-components/ComposeInput');
const InlineFiles = require('../../messages/components/InlineFiles');
const { Button, Input } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const MailSidebar = require('./MailSidebar');

class MailCompose extends ComposeInput {
    constructor() {
        super();
        this.returnToSend = true;
    }

    handleRecipientChange = value => {
        // todo validate! and populate multiple
        this.props.ghost.recipients[0] = value;
    };

    handleSubjectChange = value => {
        this.props.ghost.subject = value;
    };

    render() {
        return (
            <div className="flex-row flex-grow-1">
                <div className="compose-view">
                    <div className="compose-meta flex-row flex-shrink-0">
                        <div className="dark-label flex-col">
                            <div className="meta-input">To</div>
                            <div className="meta-input">Subject</div>
                        </div>
                        <div className="flex-grow-1">
                            <div className="meta-input">
                                {/*
                                  TODO: Grab the input from new messages.
                                  The behaviour should be the same.
                                */}
                                <div className="flex-grow-1">
                                    <Input placeholder={t('mail_enterEmail')} onChange={this.handleRecipientChange} />
                                </div>
                                <Button label={t('send')} primary onClick={this.handleSubmit} />
                            </div>
                            <div className="meta-input">
                                <Input placeholder={t('mail_enterSubject')} onChange={this.handleSubjectChange} />
                            </div>
                        </div>
                    </div>
                    <MailFormatActions
                        fileCounter={this.props.ghost.fileCounter}
                        onFileAttach={this.showFilePicker} />
                    <div className="mail-content" ref={this.activateQuill} onFocus={this.hideEmojiPicker} />
                    <InlineFiles files={this.props.ghost.files} />
                </div>
                <MailSidebar ghost={this.props.ghost} />
                {this.renderFilePicker()}
            </div>
        );
    }
}

module.exports = MailCompose;
