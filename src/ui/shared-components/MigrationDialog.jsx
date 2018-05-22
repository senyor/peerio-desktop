const React = require('react');
const { computed, observable, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { User, fileStore } = require('peerio-icebear');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const { Button, Dialog, ProgressBar } = require('~/peer-ui');
const EmojiImage = require('~/ui/emoji/Image');
const electron = require('electron').remote;
const fs = require('fs');

const migrationInProgressMessages = [];
const MIGRATION_MESSAGES_COUNT = 10;
const MESSAGE_SPEED = 8000;

for (let i = 1; i <= MIGRATION_MESSAGES_COUNT; i++) {
    const random = Math.floor(Math.random() * migrationInProgressMessages.length);

    if (i === 3) {
        migrationInProgressMessages.splice(random, 0, (
            <span>
                <T k={`title_migrationInProgressMessage${i}`} />&nbsp;
                <EmojiImage emoji="smile_cat" />
            </span>
        ));
    } else if (i === 5) {
        migrationInProgressMessages.splice(random, 0, (
            <span>
                <T k={`title_migrationInProgressMessage${i}a`} />&nbsp;
                <EmojiImage emoji="muscle" />.&nbsp;
                <T k={`title_migrationInProgressMessage${i}b`} />
            </span>
        ));
    } else {
        migrationInProgressMessages.splice(random, 0, (
            <T k={`title_migrationInProgressMessage${i}`} />
        ));
    }
}

@observer
class MigrationDialog extends React.Component {
    componentWillMount() {
        this.dispose = reaction(
            () => !fileStore.migration.started && !fileStore.migration.performedByAnotherClient,
            () => this.clearTimer()
        );
    }

    componentWillUnmount() {
        this.clearTimer();
        this.reactionsToDispose.forEach(dispose => {
            if (dispose) dispose();
        });
    }

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

    @observable count = -1;
    @computed get currentMessage() {
        return migrationInProgressMessages[this.count];
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    renderProgress() {
        if (!this.timer) {
            this.timer = setInterval(() => {
                if (this.count < migrationInProgressMessages.length - 1) {
                    this.count += 1;
                } else {
                    this.count = 0;
                }
            }, MESSAGE_SPEED);
        }

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
                <p className="text">
                    {this.count >= 0
                        ? this.currentMessage
                        : <T k="title_fileUpdateProgressDescription" />
                    }
                </p>
            </div>
        );
    }

    render() {
        // don't show migration progress if user has no shared files
        if (fileStore.migration.started && !fileStore.migration.hasLegacySharedFiles) {
            return null;
        }

        const migrationDialogActions = [{
            label: fileStore.migration.hasLegacySharedFiles ? t('button_update') : t('button_ok'),
            onClick: fileStore.migration.confirmMigration
        }];

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
                            ? (<p>
                                <T k="title_upgradeFileSystemDescription3a" />
                                <Button theme="link" onClick={this.downloadFile}>
                                    <T k="title_upgradeFileSystemLink" />
                                </Button>
                                <T k="title_upgradeFileSystemDescription3b" />
                            </p>)
                            : null
                        }
                    </div>
                }
            </Dialog>
        );
    }
}

module.exports = MigrationDialog;
