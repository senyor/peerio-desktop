const React = require('react');
const { action, observable } = require('mobx');
const { observer } = require('mobx-react');

const { warnings } = require('peerio-icebear');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');

const { Dialog, ProgressBar } = require('~/peer-ui');

@observer
class MigrationDialog extends React.Component {
    @observable migrationDialogVisible = true;
    @observable updateInProgress = false;

    // Testing vars
    @observable migrationProgress = 50;
    @observable migrationMax = 100;
    @observable userHasSharedFiles = false;
    sharedFiles = {
        fileId: '',
        filename: 'filename.txt'
    }; //

    @action.bound continueMigration() {
        this.updateInProgress = true;
    }

    @action.bound completeMigration() {
        this.updateInProgress = false;
        this.migrationDialogVisible = false;
        warnings.add('title_fileUpdateComplete');
    }

    downloadFile = () => {
        console.log('download file');
    }

    render() {
        const migrationDialogActions = [
            { label: t('button_update'), onClick: this.continueMigration }
        ];

        const textParser = {
            download: text => <a className="clickable" onClick={this.downloadFile}>{text}</a>
        };

        return (
            <Dialog active={this.migrationDialogVisible}
                className="migration-dialog"
                actions={this.updateInProgress
                    ? null
                    : migrationDialogActions
                }
                title={this.updateInProgress
                    ? t('title_fileUpdateProgress')
                    : this.userHasSharedFiles
                        ? t('title_upgradeFileSystem')
                        : t('title_newFeatureSharedFolders')
                }
                theme="primary"
            >
                {this.updateInProgress
                    ? <div className="update-in-progress">
                        <ProgressBar mode="determinate" value={this.migrationProgress} max={100} />
                        <div className="percent">{this.migrationProgress}%</div>
                        <T k="title_fileUpdateProgressDescription" tag="p" className="text" />

                        <div>TESTING ONLY:
                            <a className="clickable" onClick={this.completeMigration}>click close dialog</a>
                        </div>
                    </div>
                    : <div>
                        <T k="title_upgradeFileSystemDescription1" tag="p" />
                        <T k="title_upgradeFileSystemDescription2" tag="p" />
                        {this.userHasSharedFiles
                            ? <T k="title_upgradeFileSystemDescription3" tag="p">{textParser}</T>
                            : null
                        }
                    </div>
                }
            </Dialog>
        );
    }
}

module.exports = MigrationDialog;
