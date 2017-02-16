const React = require('react');
const MailFormatActions = require('./MailFormatActions');
const ComposeInput = require('../../shared-components/ComposeInput');
const EmailPicker = require('./EmailPicker');
const { Button, Input, Chip, ProgressBar } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const MailSidebar = require('./MailSidebar');
const { fileStore } = require('~/icebear');
const css = require('classnames');

class MailCompose extends ComposeInput {
    constructor() {
        super();
        this.returnToSend = false;
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
                            <div className="meta-input">{t('to')}</div>
                            <div className="meta-input">{t('ghost_subject')}</div>
                        </div>
                        <div className="flex-grow-1">
                            <div className="meta-input">
                                <EmailPicker ghost={this.props.ghost} />
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
                    <div className="mail-content" >
                        <div className="chip-wrapper">
                            {this.props.ghost.files.map(f => {
                                const file = fileStore.getById(f);
                                return (<Chip key={file.name}
                                              className={css('chip-label', { 'not-found': file.notFound })}
                                              onDeleteClick={() => this.props.ghost.files.remove(f)} deletable>
                                    { file.loading ? <ProgressBar type="linear" mode="indeterminate" /> : file.name }
                                </Chip>);
                            })}
                        </div>
                        <div ref={this.activateQuill} onFocus={this.hideEmojiPicker} />
                    </div>

                </div>
                <MailSidebar ghost={this.props.ghost} />
                {this.renderFilePicker()}
            </div>
        );
    }
}

module.exports = MailCompose;
