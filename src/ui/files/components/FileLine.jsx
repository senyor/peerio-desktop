const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const FileActions = require('./FileActions');
const { Checkbox } = require('react-toolbox');

@observer
class FileLine extends React.Component {
    @observable checked=false;
    toggleChecked=() => {
        this.checked = !this.checked;
    };
    render() {
        return (
            <tr /* className="new-file"*/>
                <td><Checkbox checked={this.checked} onChange={v => { this.checked = v; }} /></td>
                <td>I am a new shareable file</td>
                <td>Jeff Jefferson</td>
                <td>Oct 20 2016</td>
                <td>400MB</td>
                <td>MPEG</td>
                <FileActions onRowClick={this.toggleChecked} downloadDisabled={false} shareDisabled={false}
                         newFolderDisabled deleteDisabled={false} />
            </tr>
        );
    }
}

module.exports = FileLine;
