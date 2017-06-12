const React = require('react');
const { Checkbox } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { fileStore, clientApp } = require('~/icebear');
const Filter = require('./components/Filter');
const GlobalActions = require('./components/GlobalActions');
const FileLine = require('./components/FileLine');
const ZeroScreen = require('./components/ZeroScreen');
const { pickLocalFiles } = require('~/helpers/file');
const { t } = require('peerio-translator');
const { getListOfFiles } = require('~/helpers/file');

@observer class Files extends React.Component {
    constructor() {
        super();
        this.handleUpload = this.handleUpload.bind(this);
    }

    componentWillMount() {
        fileStore.loadAllFiles();
        clientApp.isInFilesView = true;
    }

    componentWillUnmount() {
        clientApp.isInFilesView = false;
    }

    handleUpload() {
        pickLocalFiles().then(paths => {
            if (!paths || !paths.length) return;
            const list = getListOfFiles(paths);
            if (!list.success.length) return;
            // don't refactor argument to file.upload forEach has index arg that is interpreted as a file name
            list.success.forEach((path) => fileStore.upload(path));
        });
    }

    toggleSelection = val => {
        if (val) {
            fileStore.selectAll();
        } else {
            fileStore.clearSelection();
        }
    };
    // todo: move to icebear
    handleBulkDelete = () => {
        const selected = fileStore.getSelectedFiles();
        const hasSharedFiles = selected.some((f) => f.shared);

        let msg = t('title_confirmRemoveFiles', { count: selected.length });
        if (hasSharedFiles) msg += `\n\n${t('title_confirmRemoveSharedFiles')}`;

        if (confirm(msg)) {
            Promise.map(selected, f => f.remove().then(() => {
                return new Promise(resolve => setTimeout(1000, resolve));
            }));
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
                {/* <div className={css('notice-upgrade', { show: noMoreStorage })}>
                    <div className="notice-content">{t('title_upgradeStorage')}</div>
                    <Button label={t('button_upgrade')} href={urls.upgrade} icon="open_in_browser" primary flat />
                </div> */}
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
                                    <th>{t('title_shareable')}</th>
                                    <th className="text-right">{t('title_uploaded')}</th>
                                    <th className="text-right">{t('title_size')}</th>
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
