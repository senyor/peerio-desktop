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

@observer
class FileLine extends React.Component {
    @observable showActions = false;
    toggleChecked = val => {
        this.props.file.selected = val;
    };
    deleteFile = () => {
        if (confirm(t('title_confirmRemoveFilename', { name: this.props.file.name }))) {
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
                    }</td>
                <td className="file-title">{file.name}</td>
                <td className="clickable-username" onClick={this.openContactDialog}>
                    {file.fileOwner === User.current.username ? `${t('title_you')}` : file.fileOwner}</td>
                <td className="text-right">{file.uploadedAt && file.uploadedAt.toLocaleString()}</td>
                <td className="text-right">{file.sizeFormatted}</td>
                <td>file.shareable</td>
                <FileActions downloadDisabled={!file.readyForDownload || file.downloading}
                  shareDisabled={!file.readyForDownload || !file.canShare} newFolderDisabled deleteDisabled={false}
                  onDelete={this.deleteFile} onDownload={this.download} onShare={this.share} />
                <td className="loading">
                    {(file.downloading || file.uploading)
                        ? <ProgressBar type="linear" mode="determinate" value={file.progress}
                            max={file.progressMax} />
                        : null}
                </td>
            </tr>
        );
    }
}

module.exports = FileLine;
