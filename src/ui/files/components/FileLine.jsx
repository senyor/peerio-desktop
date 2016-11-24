const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const FileActions = require('./FileActions');
const FileLoading = require('./FileLoading');
const { Checkbox, ProgressBar } = require('react-toolbox');

@observer
class FileLine extends React.Component {
    @observable checked=false;

    toggleChecked=() => {
        this.checked = !this.checked;
    };
    render() {
        return (
            <tr /* className="new-file"*/>
                <td>
                    {this.props.file.uploading
                        ? <FileLoading loading={'file_upload'} />
                        : <Checkbox checked={this.checked} onChange={v => { this.checked = v; }} />
                    }</td>
                <td>{this.props.file.name}</td>
                <td>Jeff Jefferson</td>
                <td>{this.props.file.uploadedAt && this.props.file.uploadedAt.toLocaleString()}</td>
                <td className="hide-text">{this.props.file.size}</td>
                <td className="hide-text">{this.props.file.ext}</td>
                <FileActions onRowClick={this.toggleChecked} downloadDisabled={false} shareDisabled={false}
                         newFolderDisabled deleteDisabled={false} />
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
