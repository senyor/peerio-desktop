const React = require('react');
const { fileStore } = require('~/icebear');
const { observer } = require('mobx-react');
const { observable, computed } = require('mobx');
const { Dialog, ProgressBar, List, ListItem } = require('~/react-toolbox');
const Search = require('~/ui/shared-components/Search');
const Breadcrumb = require('./Breadcrumb');
const { t } = require('peerio-translator');

const DEFAULT_RENDERED_ITEMS_COUNT = 15;

@observer
class FilePicker extends React.Component {
    @observable currentFolder = fileStore.fileFolders.root;

    @observable renderedItemsCount = DEFAULT_RENDERED_ITEMS_COUNT;
    pageSize = DEFAULT_RENDERED_ITEMS_COUNT;

    componentWillUnmount() {
        fileStore.clearFilter();
    }

    checkScrollPosition = () => {
        console.log('check scroll position');
        if (!this.container) return;
        if (this.renderedItemsCount >= this.items.length) {
            this.renderedItemsCount = this.items.length;
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

    setScrollerRef = ref => {
        if (!ref) return;
        const node = ref.querySelector('ul.file-picker-scroll-container');
        if (this.container === node) return;
        if (!node) return;
        node.addEventListener('scroll', this.enqueueCheck, false);
        node.scrollListener = true;
        this.container = node;
    }

    handleClose = () => {
        fileStore.clearSelection();
        this.props.onClose();
    };

    handleShare = () => {
        const selected = fileStore.getSelectedFiles();
        if (!selected.length) return;
        this.props.onShare(selected);
    };

    handleSearch = val => {
        if (val === '') {
            fileStore.clearFilter();
            return;
        }
        fileStore.filterByName(val);
    };

    get breadCrumbsHeader() {
        return (
            <Breadcrumb currentFolder={this.currentFolder} noActions
                onSelectFolder={this.changeFolder} />
        );
    }

    get searchResultsHeader() {
        return (
            <div className="search-results-header">
                {t('title_searchResults')}
            </div>
        );
    }

    render() {
        const actions = [
            { label: t('button_cancel'), onClick: this.handleClose },
            {
                label: t('button_share'),
                onClick: this.handleShare,
                primary: true,
                disabled: !fileStore.hasSelectedFiles
            }
        ];

        return (
            <Dialog title={t('title_shareFromFiles')}
                className="file-picker"
                actions={actions}
                active={this.props.active}
                onEscKeyDown={this.handleClose}
                onOverlayClick={this.handleClose}>
                {!fileStore.loading && this.props.active ?
                    <div ref={this.setScrollerRef}>
                        <Search onChange={this.handleSearch} query={fileStore.currentFilter} />
                        {fileStore.currentFilter ? this.searchResultsHeader : this.breadCrumbsHeader}
                        {this.renderList()}
                    </div> : null}
                { fileStore.loading && this.renderLoader() }
            </Dialog>
        );
    }

    renderLoader() {
        return (
            <div className="text-center">
                <ProgressBar type="linear" mode="indeterminate" />
            </div>
        );
    }

    renderItem = (item) => {
        return item.isFolder ? this.renderFolder(item) : this.renderFile(item);
    }

    renderFile = f => {
        return (
            f.readyForDownload && f.show && f.canShare ?
                <ListItem key={f.fileId} caption={f.name}
                    leftIcon={f.selected ? 'check_box' : 'check_box_outline_blank'}
                    onClick={() => { f.selected = !f.selected; }} />
                : <ListItem key={f.fileId} className="banish" />
        );
    };

    changeFolder = f => {
        this.currentFolder = f;
        fileStore.clearFilter();
    };

    renderFolder = f => {
        return (
            <ListItem key={f.folderId} caption={f.name}
                leftIcon="folder" onClick={() => this.changeFolder(f)} />
        );
    };

    @computed get items() {
        return fileStore.currentFilter ?
            fileStore.visibleFilesAndFolders
            : this.currentFolder.foldersAndFilesDefaultSorting;
    }

    renderList() {
        const { items } = this;
        const rendered = [];
        for (let i = 0; i < Math.min(this.renderedItemsCount, items.length); ++i) {
            rendered.push(this.renderItem(items[i]));
        }
        this.enqueueCheck();
        return (
            <List
                selectable ripple className="file-picker file-picker-scroll-container">
                {rendered}
            </List>
        );
    }
}


module.exports = FilePicker;
