const React = require('react');
const { observer } = require('mobx-react');
const { User, fileStore } = require('peerio-icebear');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const { Dialog, ProgressBar } = require('~/peer-ui');
const electron = require('electron').remote;
const fs = require('fs');

@observer
class MigrationDialog extends React.Component {
    downloadFile = () => {
        const win = electron.getCurrentWindow();
        electron.dialog.showSaveDialog(win, {
            defaultPath: `${User.current.username}-Peerio-shared-files-list.txt`
        }, this.saveFile);
    };

    async saveFile(filePath) {
        if (!filePath) return;
        fs.writeFileSync(filePath, await fileStore.getLegacySharedFilesText());
    }

    textParser = {
        download: text => <a className="clickable" onClick={this.downloadFile}>{text}</a>
    }

    renderProgress() {
        if (fileStore.migrationPerformedByAnotherClient) {
            return (
                <div className="update-in-progress">
                    <ProgressBar mode="indeterminate" />
                    <T k="title_fileUpdateProgressDescription" tag="p" className="text" />
                </div>
            );
        }
        return (
            <div className="update-in-progress">
                <ProgressBar mode="determinate" value={fileStore.migrationProgress} max={100} />
                <div className="percent">{fileStore.migrationProgress}%</div>
                <T k="title_fileUpdateProgressDescription" tag="p" className="text" />
            </div>
        );
    }

    render() {
        // don't show migration progress if user has no shared files
        if (fileStore.migrationStarted && !fileStore.hasLegacySharedFiles) {
            return null;
        }

        const migrationDialogActions = [
            { label: t('button_update'), onClick: fileStore.confirmMigration }
        ];

        return (
            <Dialog active={fileStore.migrationPending}
                className="migration-dialog"
                actions={fileStore.migrationStarted || fileStore.migrationPerformedByAnotherClient
                    ? null
                    : migrationDialogActions
                }
                title={fileStore.migrationStarted || fileStore.migrationPerformedByAnotherClient
                    ? t('title_fileUpdateProgress')
                    : fileStore.hasLegacySharedFiles
                        ? t('title_upgradeFileSystem')
                        : t('title_newFeatureSharedFolders')
                }
                theme="primary"
            >
                {fileStore.migrationStarted || fileStore.migrationPerformedByAnotherClient
                    ? this.renderProgress()
                    : <div>
                        <T k="title_upgradeFileSystemDescription1" tag="p" />
                        <T k="title_upgradeFileSystemDescription2" tag="p" />
                        {fileStore.hasLegacySharedFiles
                            ? <T k="title_upgradeFileSystemDescription3" tag="p">{this.textParser}</T>
                            : null
                        }
                    </div>
                }
            </Dialog>
        );
    }
}

module.exports = MigrationDialog;
