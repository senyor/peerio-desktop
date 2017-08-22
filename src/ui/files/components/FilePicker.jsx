const React = require('react');
const { fileStore } = require('~/icebear');
const { observer } = require('mobx-react');
const { Dialog, ProgressBar, List, ListItem } = require('~/react-toolbox');
const Search = require('~/ui/shared-components/Search');
const { t } = require('peerio-translator');

@observer
class FilePicker extends React.Component {
    handleClose = () => {
        fileStore.clearSelection();
        this.props.onClose();
    };

    handleShare = () => {
        const selected = fileStore.getSelectedFiles();
        if (!selected.length) return;
        this.props.onShare(selected);
    };

    constructor() {
        super();
        fileStore.loadAllFiles();
    }

    handleSearch = val => {
        if (val === '') {
            fileStore.clearFilter();
            return;
        }
        fileStore.filterByName(val);
    };

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
                actions={actions}
                active={this.props.active}
                onEscKeyDown={this.handleClose}
                onOverlayClick={this.handleClose}>
                {fileStore.loading ? null
                    : <Search onChange={this.handleSearch} query={fileStore.currentFilter} />}
                {fileStore.loading ? this.renderLoader() : this.renderList()}
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
    renderList() {
        return (
            <List selectable ripple className="file-picker">
                {
                    fileStore.files.map(f => {
                        return f.readyForDownload && f.show && f.canShare
                            ? <ListItem key={f.fileId} caption={f.name}
                                leftIcon={f.selected ? 'check_box' : 'check_box_outline_blank'}
                                onClick={() => { f.selected = !f.selected; }} />
                            : <ListItem key={f.fileId} className="banish" />;
                    })
                }
            </List>
        );
    }
}


module.exports = FilePicker;
