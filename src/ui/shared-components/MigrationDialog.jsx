const React = require('react');
const { action, observable } = require('mobx');
const { observer } = require('mobx-react');

const { warnings } = require('peerio-icebear');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');

const { Dialog } = require('~/peer-ui');

@observer
class MigrationDialog extends React.Component {
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

    render() {
        const migrationDialogActions = [
            { label: t('button_unshare'), onClick: this.unshare },
            { label: t('button_continue'), onClick: this.continueMigration }
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
}

module.exports = MigrationDialog;
