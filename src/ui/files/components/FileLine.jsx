const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const FileActions = require('./FileActions');
const FileLoading = require('./FileLoading');
const { Checkbox, ProgressBar } = require('react-toolbox');
const { fileStore } = require('../../../icebear');

@observer
class FileLine extends React.Component {
    @observable checked=false;
    toggleChecked = val => {
        this.checked = val;
    };
    deleteFile = () => {
        if (confirm(`Remove file ${this.props.file.name}?`)) {
            fileStore.remove(this.props.file);
        }
    };
    cancelUpload = () => {
        fileStore.cancelUpload(this.props.file);
    };
    render() {
        return (
            <tr /* className="new-file"*/ className={css({ selected: this.checked })}>
                <td>
                    {this.props.file.uploading
                        ? <FileLoading loading={'file_upload'} onCancel={this.cancelUpload} />
                        : <Checkbox checked={this.checked} onChange={this.toggleChecked} />
                    }</td>
                <td>{this.props.file.name}</td>
                <td>{this.props.file.owner}</td>
                <td>{this.props.file.uploadedAt && this.props.file.uploadedAt.toLocaleString()}</td>
                <td className="hide-text">{this.props.file.sizeFormatted}</td>
                <td className="hide-text">{this.props.file.ext}</td>
                <FileActions downloadDisabled={!this.props.file.readyForDownload} shareDisabled newFolderDisabled deleteDisabled={false}
                                onDelete={this.deleteFile} />
                <td className="loading">
                    {this.props.file.uploading
                        ? <ProgressBar type="linear" mode="determinate" value={this.props.file.progress}
                                       buffer={this.props.file.progressBuffer} />
                        : null }
                </td>
            </tr>
        );
    }
}

module.exports = FileLine;
