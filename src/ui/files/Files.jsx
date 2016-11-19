const React = require('react');
const { withRouter } = require('react-router');
const { Checkbox, IconButton } = require('react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const {fileStore} = require('../../icebear');//eslint-disable-line
const electron = require('electron').remote;
const Filter = require('./components/Filter');
const GlobalActions = require('./components/GlobalActions');
const FileLine = require('./components/FileLine');

@observer class Files extends React.Component {
    @observable checked = false;

    upload() {
        let file = electron.dialog.showOpenDialog(electron.getCurrentWindow(),
                                                  { properties: ['openFile', 'showHiddenFiles'] });

        if (!file || !file.length) return;
        file = file[0];
        fileStore.upload(file);
    }

    render() {
        const tableContainerStyle = {
            display: 'flex',
            flexShrink: '1',
            maxHeight: '100vh',
            overflow: 'auto'
        };
        return (
            <div className="files">
                <div className="table-wrapper">
                    <Filter />
                    <div className="shadow-2 flex-col" style={{ maxHeight: 'calc(100vh - 84px)' }}>
                        <GlobalActions onUpload={this.upload} />
                        <div style={tableContainerStyle}>
                            <table>
                                <thead>
                                    <tr>
                                        <th><Checkbox checked={this.checked} /></th>
                                        <th>Name</th>
                                        <th>Owner</th>
                                        <th>Modified</th>
                                        <th>Size</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <FileLine />
                                    <FileLine />
                                    <FileLine />
                                    <FileLine />

                                </tbody>
                            </table>
                        </div>
                        <div className="table-paging">
                            <div>Rows per page:</div>
                            {/* TODO make Dropdown work */}
                            {/* <Dropdown />*/}
                            <div>1-10 of 234</div>
                            <IconButton icon="chevron_left" />
                            <IconButton icon="chevron_right" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = withRouter(Files);
