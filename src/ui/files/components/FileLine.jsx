const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');

const { fileStore, User } = require('peerio-icebear');
const { downloadFile } = require('~/helpers/file');
const moment = require('moment');
const css = require('classnames');
const { t } = require('peerio-translator');
const uiStore = require('~/stores/ui-store');

const { Checkbox } = require('~/peer-ui');
const { ProgressBar } = require('~/react-toolbox');

const FileActions = require('./FileActions');
const FileLoading = require('./FileLoading');
const FileSpriteIcon = require('~/ui/shared-components/FileSpriteIcon');
const MoveFileDialog = require('./MoveFileDialog');

@observer
class FileLine extends React.Component {
    // 21 hour limit for displaying relative timestamp (because moment.js says '1 day' starting from 21h)
    static relativeTimeDisplayLimit = 21 * 60 * 60 * 1000;

    @observable showActions = false;

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

    render() {
        const { file } = this.props;
        if (!file.show) return null;

        // We want relative timestamp in case it's not older then 1 day.
        // In case of relative timestamp we also want to re-render periodically to update it
        let uploadedAt, uploadedAtTooltip;

        if (file.uploadedAt) {
            // if file timestamp is past the limit...
            if (Date.now() - file.uploadedAt > FileLine.relativeTimeDisplayLimit) {
                uploadedAt = file.uploadedAt.toLocaleString();
                // this condition is always true and we need it only to subscribe to clock updates
            } else if (uiStore.minuteClock.now) {
                uploadedAt = moment(file.uploadedAt).fromNow();
                uploadedAtTooltip = file.uploadedAt.toLocaleString();
            }
        }

        const containerStyle = {
            selected: this.checked,
            'selected-row': file.selected,
            'waiting-3rd-party': !file.uploading && !file.readyForDownload
        };

        return (
            <div
                data-fileid={file.fileId}
                className={css('row', containerStyle)}
                onMouseEnter={this.onShowActions}
                onMouseLeave={this.onHideActions}>

                {this.props.checkbox &&
                    <Checkbox
                        className="file-checkbox"
                        checked={this.props.selected}
                        onChange={this.props.onToggleSelect}
                    />
                }

                {this.props.fileDetails &&
                    <div className="loading-icon">
                        {(file.downloading || file.uploading)
                            && <FileLoading loading={file.downloading ? 'file_download' : 'file_upload'}
                                onCancel={this.cancelUploadOrDownload} />
                        }
                    </div>
                }

                <div className="file-icon">
                    <FileSpriteIcon type={file.iconType} size="medium" />
                </div>

                <div className="file-name selectable"
                    onClick={this.props.clickToSelect
                        ? this.props.onToggleSelect
                        : this.download
                    } >
                    {file.name}
                </div>

                {this.props.fileDetails &&
                    <div className="file-owner" onClick={this.openContactDialog}>
                        {file.fileOwner === User.current.username ? `${t('title_you')}` : file.fileOwner}
                    </div>
                }

                {this.props.fileDetails &&
                    <div className="file-uploaded text-right" title={uploadedAtTooltip}>
                        {uploadedAt}
                    </div>
                }

                {this.props.fileDetails &&

                    <div className="file-size text-right">{file.sizeFormatted}</div>
                }

                {this.props.fileActions &&
                    <div className="file-actions text-right">
                        <FileActions
                            downloadDisabled={!file.readyForDownload || file.downloading} onDownload={this.download}
                            shareable shareDisabled={!file.readyForDownload || !file.canShare} onShare={this.share}
                            newFolderDisabled
                            onRename={this.renameFile}
                            moveable={this.props.moveable}
                            onMove={this.moveFile}
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
                }

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
