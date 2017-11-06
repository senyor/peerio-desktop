const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const FileActions = require('./FileActions');
const FileLoading = require('./FileLoading');
const { Checkbox, ProgressBar } = require('~/react-toolbox');
const { fileStore, User } = require('~/icebear');
const { downloadFile } = require('~/helpers/file');
const uiStore = require('~/stores/ui-store');
const { t } = require('peerio-translator');
const moment = require('moment');
const FileSpriteIcon = require('~/ui/shared-components/FileSpriteIcon');

@observer
class FileLine extends React.Component {
    // 21 hour limit for displaying relative timestamp (because moment.js says '1 day' starting from 21h)
    static relativeTimeDisplayLimit = 21 * 60 * 60 * 1000;

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

    share = () => {
        fileStore.clearSelection();
        this.props.file.selected = true;
        window.router.push('/app/sharefiles');
    };

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
        const file = this.props.file;
        if (!file.show) return null;

        // We want relative timestamp in case it's not older then 1 day.
        // In case of relative timestamp we also want to re-render periodically to update it
        let uploadedAt, uploadedAtTooltip;

        // if file timestamp is past the limit...
        if (Date.now() - file.uploadedAt > FileLine.relativeTimeDisplayLimit) {
            uploadedAt = file.uploadedAt.toLocaleString();
            // this condition is always true and we need it only to subscribe to clock updates
        } else if (uiStore.minuteClock.now) {
            uploadedAt = moment(file.uploadedAt).fromNow();
            uploadedAtTooltip = file.uploadedAt.toLocaleString();
        }

        return (
            <tr className={css({
                selected: this.checked,
                'selected-row': file.selected,
                'waiting-3rd-party': !file.uploading && !file.readyForDownload
            })}
            onMouseEnter={this.onShowActions} onMouseLeave={this.onHideActions}>

                <td>
                    {(file.downloading || file.uploading)
                        ? <FileLoading loading={file.downloading ? 'file_download' : 'file_upload'}
                            onCancel={this.cancelUploadOrDownload} />
                        : <Checkbox disabled={!file.readyForDownload} checked={file.selected}
                            onChange={this.toggleChecked} />
                    }
                </td>

                <td className="file-icon">
                    <FileSpriteIcon type={file.iconType} size="medium" />
                </td>

                <td className="file-title selectable" onClick={this.download}>{file.name}</td>

                <td className="clickable-username" onClick={this.openContactDialog}>
                    {file.fileOwner === User.current.username ? `${t('title_you')}` : file.fileOwner}
                </td>

                {/* <td>{file.canShare ? t('button_yes') : ''} </td> */}

                <td className="text-right" title={uploadedAtTooltip}>
                    {uploadedAt}
                </td>

                <td className="text-right">{file.sizeFormatted}</td>

                <td className="text-right">
                    <FileActions
                        downloadDisabled={!file.readyForDownload || file.downloading}
                        shareDisabled={!file.readyForDownload || !file.canShare}
                        newFolderDisabled
                        deleteDisabled={false}
                        onDelete={this.deleteFile}
                        onDownload={this.download}
                        onShare={this.share} />
                </td>

                {(file.downloading || file.uploading)
                    ? <td className="loading">
                        <ProgressBar type="linear" mode="determinate" value={file.progress}
                            max={file.progressMax} />
                    </td>
                    : null}
            </tr>
        );
    }
}

module.exports = FileLine;
