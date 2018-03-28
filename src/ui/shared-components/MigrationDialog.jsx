const React = require('react');
const { action, observable } = require('mobx');
const { observer } = require('mobx-react');
const { warnings, fileStore } = require('peerio-icebear');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const { Dialog, ProgressBar } = require('~/peer-ui');
const electron = require('electron').remote;
const fs = require('fs');

@observer
class MigrationDialog extends React.Component {
    downloadFile = () => {
        const win = electron.getCurrentWindow();
        electron.dialog.showSaveDialog(win, { defaultPath: 'files.txt' }, this.saveFile);
    };

    saveFile(filePath) {
        if (!filePath) return;
        fs.writeFileSync(filePath, fileStore.getLegacySharedFilesText());
    }

    textParser = {
        download: text => <a className="clickable" onClick={this.downloadFile}>{text}</a>
    }

    render() {
        const migrationDialogActions = [
            { label: t('button_update'), onClick: fileStore.confirmMigration }
        ];

        return (
            <Dialog active={fileStore.migrationPending}
                className="migration-dialog"
                actions={fileStore.migrationStarted
                    ? null
                    : migrationDialogActions
                }
                title={fileStore.migrationStarted
                    ? t('title_fileUpdateProgress')
                    : fileStore.hasLegacySharedFiles
                        ? t('title_upgradeFileSystem')
                        : t('title_newFeatureSharedFolders')
                }
                theme="primary"
            >
                {fileStore.migrationStarted
                    ? <div className="update-in-progress">
                        <ProgressBar mode="determinate" value={fileStore.migrationProgress} max={100} />
                        <div className="percent">{fileStore.migrationProgress}%</div>
                        <T k="title_fileUpdateProgressDescription" tag="p" className="text" />
                    </div>
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
