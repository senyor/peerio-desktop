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
    @observable fileLoading = true;

    toggleChecked=() => {
        this.checked = !this.checked;
    };
    render() {
        return (
            <tr /* className="new-file"*/>
                {/* TODO change Checkbox to FileLoading when uploading and downloading files*/}
                <td>
                    {this.fileLoading ?
                        <FileLoading loading={'file_upload'} /> :
                            <Checkbox checked={this.checked} onChange={v => { this.checked = v; }} />
                    }</td>
                <td>I am a new shareable file</td>
                <td>Jeff Jefferson</td>
                <td>Oct 20 2016</td>
                <td className="hide-text">400MB</td>
                <td className="hide-text">MPEG</td>
                <FileActions onRowClick={this.toggleChecked} downloadDisabled={false} shareDisabled={false}
                         newFolderDisabled deleteDisabled={false} />
                <td className="loading">
                    {this.fileLoading ? <ProgressBar type="linear" mode="indeterminate" /> : null }
                </td>
            </tr>
        );
    }
}

module.exports = FileLine;
