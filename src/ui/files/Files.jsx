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
        fileStore.deselectUnshareableFiles();
        if (!fileStore.selectedCount) return;
        window.router.push('/app/sharefiles');
    };

    render() {
        if (!fileStore.files.length && !fileStore.loading) return <ZeroScreen onUpload={this.handleUpload} />;

        return (
            <div className="files">
                <div className="file-wrapper">
                    <Filter />
                    <GlobalActions onUpload={this.handleUpload} onDelete={this.handleBulkDelete}
                      onShare={this.handleFileShareIntent} />
                    <div className="file-table-wrapper">
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
                                    <th>{t('title_permissions')}</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {fileStore.files.map(f => <FileLine key={f.fileId} file={f} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Files;
