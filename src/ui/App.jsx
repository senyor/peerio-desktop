const React = require('react');
const AppNav = require('~/ui/AppNav');
const uiStore = require('~/stores/ui-store');
const { Dialog, ProgressBar } = require('~/peer-ui');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const ContactProfile = require('~/ui/contact/components/ContactProfile');
const { observer } = require('mobx-react');
const { action, observable } = require('mobx');
const { clientApp, warnings } = require('peerio-icebear');

@observer
class App extends React.Component {
    // for smooth dialog hiding, without this it will render empty dialog while hiding it
    @observable contactDialogHiding = false;
    hideContactDialog = () => {
        this.contactDialogHiding = true;

        setTimeout(() => {
            uiStore.contactDialogUsername = null;
            this.contactDialogHiding = false;
        }, 500);
    };

    get signatureErrorDialog() {
        const hide = uiStore.hideFileSignatureErrorDialog;
        const dialogActions = [
            { label: t('button_dismiss'), onClick: hide }
        ];
        return (
            <Dialog
                active={uiStore.isFileSignatureErrorDialogActive}
                actions={dialogActions}
                onCancel={hide}
                title={t('title_invalidFileSignature')}
                className="dialog-warning">
                <p>{t('error_invalidFileSignatureLong')}</p>
            </Dialog>
        );
    }

    @observable migrationDialogVisible = true;
    @observable unshareSelected = false;

    sharedFiles = {
        fileId: '',
        filename: 'filename.txt'
    };

    @action.bound unshare() {
        this.unshareSelected = true;
    }

    @action.bound continueMigration() {
        this.migrationDialogVisible = false;
        warnings.add(t('warning_sharingHistory'));
    }

    @action.bound cancelUnshare() {
        this.unshareSelected = false;
    }

    @action.bound continueUnshare() {
        this.migrationDialogVisible = false;
        warnings.add(t('warning_unsharedAll'));
    }

    downloadFile = () => {
        console.log('download file');
    }

    get migrationDialog() {
        const migrationDialogActions = [
            { label: t('button_no'), onClick: this.unshare },
            { label: t('button_yes'), onClick: this.continueMigration }
        ];

        const unshareDialogActions = [
            { label: t('button_cancel'), onClick: this.cancelUnshare },
            { label: t('button_unshareAll'), onClick: this.continueUnshare }
        ];

        const textParser = {
            downloadFile: () => <a className="clickable" onClick={this.downloadFile}>{this.sharedFiles.filename}</a>
        };

        return (
            <Dialog active={this.migrationDialogVisible}
                actions={this.unshareSelected
                    ? unshareDialogActions
                    : migrationDialogActions
                }
                title={this.unshareSelected
                    ? t('dialog_unshareTitle')
                    : t('dialog_migrationTitle')
                }
                theme="warning"
            >
                {this.unshareSelected
                    ? <T k="dialog_unshareText" />
                    : <T k="dialog_migrationText">{textParser}</T>
                }
            </Dialog>
        );
    }

    componentWillMount() {
        uiStore.init();
    }

    render() {
        const contactDialogActions = [
            { label: t('button_close'), onClick: this.hideContactDialog }
        ];

        return (
            <div className="app-root">
                <AppNav />
                {clientApp.updatingAfterReconnect
                    ? <div className="global-update-progress"><ProgressBar type="linear" mode="indeterminate" /></div>
                    : null}

                {this.props.children}
                <Dialog active={!this.contactDialogHiding && !!uiStore.contactDialogUsername}
                    actions={contactDialogActions}
                    onCancel={this.hideContactDialog}
                    title={t('title_settingsProfile')}>
                    {
                        uiStore.contactDialogUsername
                            ? <ContactProfile username={uiStore.contactDialogUsername}
                                onClose={this.hideContactDialog} />
                            : null
                    }
                </Dialog>
                {this.migrationDialog}
                {this.signatureErrorDialog}
            </div>
        );
    }
}

module.exports = App;
