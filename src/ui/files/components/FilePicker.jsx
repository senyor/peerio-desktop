const React = require('react');
const { fileStore } = require('~/icebear');
const { autorun } = require('mobx');
const { observer } = require('mobx-react');
const { Dialog, ProgressBar, List, ListItem } = require('~/react-toolbox');
const Search = require('~/ui/shared-components/Search');

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
    actions = [
        { label: 'Cancel', onClick: this.handleClose },
        { label: 'Share', onClick: this.handleShare, primary: true, disabled: true }
    ];

    constructor() {
        super();
        fileStore.loadAllFiles();
        autorun(() => {
            this.actions[1].disabled = !fileStore.hasSelectedFiles;
            if (this.mounted) this.forceUpdate();
        });
    }

    componentDidMount() {
        this.mounted = true;
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    handleSearch = val => {
        if (val === '') {
            fileStore.clearFilter();
            return;
        }
        fileStore.filterByName(val);
    };

    render() {
        return (
            <Dialog title="Share Files"
                    actions={this.actions}
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
                        return f.readyForDownload && f.show
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
