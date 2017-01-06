const React = require('react');
const { Checkbox } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { fileStore } = require('~/icebear');
const electron = require('electron').remote;
const Filter = require('./components/Filter');
const GlobalActions = require('./components/GlobalActions');
const FileLine = require('./components/FileLine');
const ZeroScreen = require('./components/ZeroScreen');

@observer class Files extends React.Component {
    @observable allSelected = false;

    constructor() {
        super();
        this.upload = this.upload.bind(this);
    }

    componentWillMount() {
        fileStore.loadAllFiles();
    }

    componentWillUnmount() {
        fileStore.clearSelection();
    }

    upload() {
        const win = electron.getCurrentWindow();
        electron.dialog.showOpenDialog(win, { properties: ['openFile', 'showHiddenFiles'] },
            paths => {
                if (!paths || !paths.length) return;
                fileStore.upload(paths[0]);
            });
    }

    toggleSelection = val => {
        if (val) {
            fileStore.selectAll();
        } else {
            fileStore.clearSelection();
        }
    };

    handleBulkDelete = () => {
        const selected = fileStore.getSelectedFiles();
        if (confirm(`Remove ${selected.length} file(s)?`)) {
            selected.forEach(f => fileStore.remove(f));
        }
    };

    render() {
        if (!fileStore.files.length && !fileStore.loading) return <ZeroScreen onUpload={this.upload} />;
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
                        <GlobalActions onUpload={this.upload} onDelete={this.handleBulkDelete} />
                        <div style={tableContainerStyle}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            <Checkbox checked={fileStore.allSelected}
                                                      onChange={this.toggleSelection} />
                                        </th>
                                        <th>Name</th>
                                        <th>Owner</th>
                                        <th>Uploaded</th>
                                        <th>Size</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fileStore.files.map(f => <FileLine key={f.fileId} file={f} />)}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-paging">
                            {/* <div>Rows per page:</div>*/}
                            {/* /!* TODO make Dropdown work *!/*/}
                            {/* /!* <Dropdown />*!/*/}
                            {/* <div>1-10 of 234</div>*/}
                            {/* <IconButton icon="chevron_left" />*/}
                            {/* <IconButton icon="chevron_right" />*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Files;
