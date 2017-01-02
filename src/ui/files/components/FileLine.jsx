const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const FileActions = require('./FileActions');
const FileLoading = require('./FileLoading');
const { Checkbox, ProgressBar } = require('react-toolbox');
const { fileStore } = require('~/icebear');
const electron = require('electron').remote;

@observer
class FileLine extends React.Component {
    @observable checked=false;
    @observable showActions=false;
    toggleChecked = val => {
        this.checked = val;
    };
    deleteFile = () => {
        if (confirm(`Remove file ${this.props.file.name}?`)) {
            fileStore.remove(this.props.file);
        }
    };
    cancelUploadOrDownload = () => {
        if (this.props.file.uploading) fileStore.cancelUpload(this.props.file);
        else fileStore.cancelDownload(this.props.file);
    };
    download = () => {
        let path = this.props.file.name;
        try {
            const downloadsDir = electron.app.getPath('downloads');
            path = `${downloadsDir}/${path}`;
        } catch (err) {
            console.log(err);
        }

        const win = electron.getCurrentWindow();
        electron.dialog.showSaveDialog(win, { defaultPath: path }, fileSavePath => {
            if (fileSavePath) {
                this.props.file.download(fileSavePath)
                    .then(() => {
                        electron.app.dock.downloadFinished(fileSavePath);
                    });
            }
        });
    };
    onShowActions = () => {
        this.showActions = true;
    };
    onHideActions = () => {
        this.showActions = false;
    };

    render() {
        return (
            <tr /* className="new-file"*/ className={css({ selected: this.checked })}
                                          onMouseEnter={this.onShowActions} onMouseLeave={this.onHideActions}>
                <td>
                    {(this.props.file.downloading || this.props.file.uploading)
                        ? <FileLoading loading={this.props.file.downloading ? 'file_download' : 'file_upload'}
                                       onCancel={this.cancelUploadOrDownload} />
                        : <Checkbox checked={this.checked} onChange={this.toggleChecked} />
                    }</td>
                <td>{this.props.file.name}</td>
                <td>{this.props.file.owner}</td>
                <td>{this.props.file.uploadedAt && this.props.file.uploadedAt.toLocaleString()}</td>
                <td className="hide-text">{this.props.file.sizeFormatted}</td>
                <td className="hide-text uppercase">{this.props.file.ext}</td>
                {
                    this.showActions
                    ? <FileActions downloadDisabled={
                        (!this.props.file.readyForDownload
                            || this.props.file.downloading
                            || this.props.file.uploading)}
                             shareDisabled newFolderDisabled deleteDisabled={false}
                                onDelete={this.deleteFile} onDownload={this.download} />
                    : null
                }

                <td className="loading">
                    {(this.props.file.downloading || this.props.file.uploading)
                        ? <ProgressBar type="linear" mode="determinate" value={this.props.file.progress}
                                       buffer={this.props.file.progressBuffer} max={this.props.file.progressMax} />
                        : null }
                </td>
            </tr>
        );
    }
}

module.exports = FileLine;
