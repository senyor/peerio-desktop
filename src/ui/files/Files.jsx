const React = require('react');
const { Checkbox } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { observable } = require('mobx');
const { fileStore, clientApp } = require('~/icebear');
const Filter = require('./components/Filter');
const GlobalActions = require('./components/GlobalActions');
const FileLine = require('./components/FileLine');
const ZeroScreen = require('./components/ZeroScreen');
const { pickLocalFiles } = require('~/helpers/file');
const { t } = require('peerio-translator');
const { getListOfFiles } = require('~/helpers/file');

@observer
class Files extends React.Component {
    constructor() {
        super();
        this.handleUpload = this.handleUpload.bind(this);
    }

    @observable renderedItemsCount = 15;
    pageSize = 15;

    componentWillMount() {
        fileStore.loadAllFiles();
        clientApp.isInFilesView = true;
    }

    componentDidMount() {
        window.addEventListener('resize', this.enqueueCheck, false);
    }

    componentWillUnmount() {
        clientApp.isInFilesView = false;
        window.removeEventListener('resize', this.enqueueCheck);
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
        if (!selected.length) return;

        let msg = t('title_confirmRemoveFiles', { count: selected.length });
        if (hasSharedFiles) msg += `\n\n${t('title_confirmRemoveSharedFiles')}`;

        if (confirm(msg)) {
            let i = 0;
            const removeOne = () => {
                const f = selected[i];
                f.remove().then(() => {
                    if (++i >= selected.length) return;
                    setTimeout(removeOne, 250);
                });
            };
            removeOne();
        }
    };

    handleFileShareIntent = () => {
        fileStore.deselectUnshareableFiles();
        if (!fileStore.selectedCount) return;
        window.router.push('/app/sharefiles');
    };

    checkScrollPosition = () => {
        if (!this.container) return;
        if (this.renderedItemsCount >= fileStore.visibleFiles.length) {
            this.renderedItemsCount = fileStore.visibleFiles.length;
            return;
        }

        const distanceToBottom = this.container.scrollHeight - this.container.scrollTop - this.container.clientHeight;
        if (distanceToBottom < 250) {
            this.renderedItemsCount += this.pageSize;
        }
    };

    enqueueCheck = () => {
        window.requestAnimationFrame(this.checkScrollPosition);
    };

    setContainerRef = (ref) => {
        this.container = ref;
        this.enqueueCheck();
    }

    render() {
        if (!fileStore.visibleFiles.length && !fileStore.loading) return <ZeroScreen onUpload={this.handleUpload} />;
        const files = [];
        for (let i = 0; i < this.renderedItemsCount && i < fileStore.visibleFiles.length; i++) {
            const f = fileStore.visibleFiles[i];
            files.push(<FileLine key={f.fileId} file={f} />);
        }
        this.enqueueCheck();
        return (
            <div className="files">
                <div className="file-wrapper">
                    <Filter />
                    <GlobalActions onUpload={this.handleUpload} onDelete={this.handleBulkDelete}
                        onShare={this.handleFileShareIntent} />
                    <div className="file-table-wrapper" ref={this.setContainerRef} onScroll={this.enqueueCheck}>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <Checkbox checked={fileStore.allVisibleSelected}
                                            onChange={this.toggleSelection} />
                                    </th>
                                    <th>{t('title_name')}</th>
                                    <th>{t('title_owner')}</th>
                                    {/* <th>{t('title_shareable')}</th> */}
                                    <th className="text-right">{t('title_uploaded')}</th>
                                    <th className="text-right">{t('title_size')}</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {files}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Files;
