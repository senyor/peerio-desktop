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
        fs.writeFileSync(filePath, await fileStore.migration.getLegacySharedFilesText());
    }

    textParser = {
        download: text => <a className="clickable" onClick={this.downloadFile}>{text}</a>
    }

    renderProgress() {
        if (fileStore.migration.performedByAnotherClient) {
            return (
                <div className="update-in-progress">
                    <ProgressBar mode="indeterminate" />
                    <T k="title_fileUpdateProgressDescription" tag="p" className="text" />
                </div>
            );
        }
        return (
            <div className="update-in-progress">
                <ProgressBar mode="determinate" value={fileStore.migration.progress} max={100} />
                <div className="percent">{fileStore.migration.progress}%</div>
                <T k="title_fileUpdateProgressDescription" tag="p" className="text" />
            </div>
        );
    }

    render() {
        // don't show migration progress if user has no shared files
        if (fileStore.migration.started && !fileStore.migration.hasLegacySharedFiles) {
            return null;
        }

        const migrationDialogActions = [
            { label: t('button_update'), onClick: fileStore.migration.confirmMigration }
        ];

        return (
            <Dialog active={fileStore.migration.pending}
                className="migration-dialog"
                actions={fileStore.migration.started || fileStore.migration.performedByAnotherClient
                    ? null
                    : migrationDialogActions
                }
                title={fileStore.migration.started || fileStore.migration.performedByAnotherClient
                    ? t('title_fileUpdateProgress')
                    : fileStore.migration.hasLegacySharedFiles
                        ? t('title_upgradeFileSystem')
                        : t('title_newFeatureSharedFolders')
                }
                theme="primary"
            >
                {fileStore.migration.started || fileStore.migration.performedByAnotherClient
                    ? this.renderProgress()
                    : <div>
                        <T k="title_upgradeFileSystemDescription1" tag="p" />
                        <T k="title_upgradeFileSystemDescription2" tag="p" />
                        {fileStore.migration.hasLegacySharedFiles
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
