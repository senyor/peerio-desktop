const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const FileActions = require('./FileActions');
const FileLoading = require('./FileLoading');
const { ProgressBar } = require('~/react-toolbox');
const { fileStore, User } = require('~/icebear');
const { downloadFile } = require('~/helpers/file');
const uiStore = require('~/stores/ui-store');
const { t } = require('peerio-translator');
const moment = require('moment');
const FileSpriteIcon = require('~/ui/shared-components/FileSpriteIcon');
const MoveFileDialog = require('./MoveFileDialog');

@observer
class FileLine extends React.Component {
    @observable showActions = false;

    toggleChecked = val => {
        this.props.file.selected = val;
    };

    deleteFile = () => {
        let msg = t('title_confirmRemoveFilename', { name: this.props.file.name });
        if (this.props.file.shared) {
            msg += `\n\n${t('title_confirmRemoveSharedFiles')}`;
        }
        if (confirm(msg)) {
            this.props.file.remove();
        }
    };

    cancelUploadOrDownload = () => {
        this.props.file.cancelUpload();
        this.props.file.cancelDownload();
    };

    download = () => {
        downloadFile(this.props.file);
    };

    goToFolder = () => {
        // navigate to clicked folder
    }

    share = () => {
        fileStore.clearSelection();
        this.props.file.selected = true;
        window.router.push('/app/sharefiles');
    };

    renameFile = () => {

    }

    @observable moveFileVisible = false;
    moveFile = () => {
        this.moveFileVisible = true;
    }

    hideMoveFile = () => {
        this.moveFileVisible = false;
    }

    onShowActions = () => {
        this.showActions = true;
    };

    onHideActions = () => {
        this.showActions = false;
    };

    openContactDialog = () => {
        uiStore.contactDialogUsername = this.props.file.fileOwner;
    };

    formatDate(date) {
        if (!date) return '';
        return moment(date).fromNow();
    }

    render() {
        const file = this.props.file;
        if (!file.show) return null;
        // minuteClock.now is never null, but this will subscribe us to clock events to re-render relative timesamp
        if (!uiStore.minuteClock.now) return null;

        return (
            <div className={css(
                'row',
                {
                    selected: this.checked,
                    'selected-row': file.selected,
                    'waiting-3rd-party': !file.uploading && !file.readyForDownload
                }
            )}
            onMouseEnter={this.onShowActions} onMouseLeave={this.onHideActions}>

                <div className="loading-icon">
                    {(file.downloading || file.uploading)
                        && <FileLoading loading={file.downloading ? 'file_download' : 'file_upload'}
                            onCancel={this.cancelUploadOrDownload} />
                    }
                </div>

                <div className="file-icon">
                    <FileSpriteIcon type={file.iconType} size="medium" />
                </div>

                <div className="file-name selectable"
                    onClick={this.download} >
                    {file.name}
                </div>

                <div className="file-owner" onClick={this.openContactDialog}>
                    {file.fileOwner === User.current.username ? `${t('title_you')}` : file.fileOwner}
                </div>

                <div className="file-uploaded text-right" title={
                    file.uploadedAt ? file.uploadedAt.toLocaleString() : ''
                }>
                    {this.formatDate(file.uploadedAt)}
                </div>

                <div className="file-size text-right">{file.sizeFormatted}</div>

                <div className="file-actions text-right">
                    <FileActions
                        downloadDisabled={!file.readyForDownload || file.downloading} onDownload={this.download}
                        shareable shareDisabled={!file.readyForDownload || !file.canShare} onShare={this.share}
                        newFolderDisabled
                        onRename={this.renameFile}
                        moveable onMove={this.moveFile}
                        deleteable onDelete={this.deleteFile}
                    />
                    {this.moveFileVisible && this.props.currentFolder &&
                        <MoveFileDialog
                            file={file}
                            currentFolder={this.props.currentFolder}
                            visible={this.moveFileVisible}
                            onHide={this.hideMoveFile}
                        />
                    }
                </div>

                {(file.downloading || file.uploading)
                    ? <div className="loading">
                        <ProgressBar type="linear" mode="determinate" value={file.progress}
                            max={file.progressMax} />
                    </div>
                    : null}
            </div>
        );
    }
}

module.exports = FileLine;
