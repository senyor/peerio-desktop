const React = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const MailFormatActions = require('./MailFormatActions');
const ComposeInput = require('../../shared-components/ComposeInput');
const EmailPicker = require('./EmailPicker');
const { Dialog, Button, Input, Chip, ProgressBar } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const MailPassphrase = require('./MailPassphrase');
const { fileStore } = require('~/icebear');
const css = require('classnames');

@observer class MailCompose extends ComposeInput {
    @observable dialogActive = false;

    @computed get valid() {
        return this.props.ghost.recipients.length > 0;
    }
    // todo: update on locale change
    dialogActions = [
        { label: t('cancel'), onClick: () => { this.hideDialog(); } },
        { label: t('send'),
            onClick: () => {
                this.handleSubmit();
                this.hideDialog();
            }
        }
    ];

    constructor() {
        super();
        this.permitEmptyBody = true;
        this.returnToSend = false;
    }

    hideDialog = () => {
        this.dialogActive = false;
    };

    handleSubjectChange = value => {
        this.props.ghost.subject = value;
    };

    validateAndSubmit = () => {
        if (this.valid) {
            if (this.props.ghost.subject.length === 0 &&
                this.getCleanContents() === '') {
                this.dialogActive = true;
            } else {
                this.handleSubmit();
            }
        }
    };

    showFilePicker = () => {
        // may have last been open elsewhere
        fileStore.clearSelection();
        this.props.ghost.files.forEach((fileId) => {
            fileStore.getById(fileId).selected = true;
        });
        this.filePickerActive = true;
    };


    render() {
        return (
            <div className="flex-row flex-grow-1">
                <div className="compose-view">
                    <div className="compose-meta flex-row flex-shrink-0">
                        <div className="dark-label flex-col flex-justify-between">
                            <div className="meta-input">{t('to')}</div>
                            <div className="meta-input">{t('ghost_subject')}</div>
                        </div>
                        <div className="flex-grow-1">
                            <div className="meta-input">
                                <EmailPicker ghost={this.props.ghost} />
                                <Button label={t('send')}
                                        primary
                                        disabled={!this.valid}
                                        onClick={this.validateAndSubmit}
                                />
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
                <div className="mail-sidebar">
                    <MailPassphrase ghost={this.props.ghost} />
                </div>
                {this.renderFilePicker()}

                <Dialog actions={this.dialogActions}
                        active={this.dialogActive}
                        onEscKeyDown={this.hideDialog}
                        onOverlayClick={this.hideDialog}
                        title={t('ghost_emptyTitle')}>
                    <p>{t('ghost_emptyText')}</p>
                </Dialog>
            </div>
        );
    }
}

module.exports = MailCompose;
