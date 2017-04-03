const React = require('react');
const { Checkbox } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { fileStore } = require('~/icebear');
const Filter = require('./components/Filter');
const GlobalActions = require('./components/GlobalActions');
const FileLine = require('./components/FileLine');
const ZeroScreen = require('./components/ZeroScreen');
const { pickSystemFiles } = require('~/helpers/file');
const { t } = require('peerio-translator');

@observer class Files extends React.Component {
    constructor() {
        super();
        this.handleUpload = this.handleUpload.bind(this);
    }

    componentWillMount() {
        fileStore.loadAllFiles();
        fileStore.active = true;
    }

    componentWillUnmount() {
        fileStore.active = false;
    }

    handleUpload() {
        pickSystemFiles().then(paths => {
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
        if (confirm(t('title_confirmRemoveFiles', { count: selected.length }))) {
            selected.forEach(f => f.remove());
        }
    };

    handleFileShareIntent = () => {
        window.router.push('/app/sharefiles');
    };

    render() {
        if (!fileStore.files.length && !fileStore.loading) return <ZeroScreen onUpload={this.handleUpload} />;
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
                    <div className="flex-col" style={{ maxHeight: 'calc(100vh - 84px)' }}>
                        <GlobalActions onUpload={this.handleUpload} onDelete={this.handleBulkDelete}
                            onShare={this.handleFileShareIntent} />
                        <div style={tableContainerStyle}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            <Checkbox checked={fileStore.allVisibleSelected}
                                                onChange={this.toggleSelection} />
                                        </th>
                                        <th>{t('title_name')}</th>
                                        <th>{t('title_owner')}</th>
                                        <th className="text-right">{t('title_uploaded')}</th>
                                        <th className="text-right">{t('title_size')}</th>
                                        <th>{t('title_type')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fileStore.files.map(f => <FileLine key={f.fileId} file={f} />)}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-paging">
                            {/* <div>Rows per page:</div> */}
                            {/* TODO make Dropdown work */}
                            {/* <Dropdown /> */}
                            {/* <div>1-10 of 234</div> */}
                            {/* <IconButton icon="chevron_left" /> */}
                            {/* <IconButton icon="chevron_right" /> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Files;
