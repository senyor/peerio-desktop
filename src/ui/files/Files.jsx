const React = require('react');
const { Button, Checkbox, IconButton } = require('react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { fileStore } = require('~/icebear');
const electron = require('electron').remote;
const Filter = require('./components/Filter');
const GlobalActions = require('./components/GlobalActions');
const FileLine = require('./components/FileLine');

@observer class Files extends React.Component {
    @observable checked = false;

    constructor() {
        super();
        this.upload = this.upload.bind(this);
        this.noFiles = this.noFiles.bind(this);
    }

    componentWillMount() {
        fileStore.loadAllFiles();
    }

    upload() {
        const win = electron.getCurrentWindow();
        electron.dialog.showOpenDialog(win, { properties: ['openFile', 'showHiddenFiles'] },
            paths => {
                if (!paths || !paths.length) return;
                fileStore.upload(paths[0]);
            });
    }

    noFiles() {
        return (
            <div className="files">
                <div className="flex-row zero-file">
                    <div className="flex-col flex-grow-1" />
                    <div className="flex-col flex-grow-0 flex-shrink-0">
                        <div className="flex-row" style={{ marginTop: '64px' }}>
                            <div className="display-3">Secure your files.</div>
                        </div>
                        <div className="flex-row flex-align-start" style={{ width: '100%' }}>
                            <div className="flex-col flex-align-start">
                                <p className="heading"
                                   style={{
                                       marginBottom: '48px',
                                       lineHeight: '1.4'
                                   }}>
                                    Drag and drop, upload,
                                    <br />
                                    share, and manage
                                    <br />
                                    your files.
                                </p>
                                <Button onClick={this.upload} primary label="upload" />
                            </div>
                            <img src="static/img/file-upload.png"
                                 style={{ maxWidth: '280px', minWidth: '40%' }} role="presentation" />
                        </div>
                        <p className="upgrade">Upgrade your account?</p>
                    </div>
                    <div className="flex-col flex-grow-1" />
                </div>
            </div>);
    }

    render() {
        if (!fileStore.files.length && !fileStore.loading) return this.noFiles();
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

module.exports = Files;
