const React = require('react');
const { fileStore } = require('~/icebear');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Dialog, ProgressBar, List, ListItem, ListSubHeader, ListDivider, ListCheckbox } = require('~/react-toolbox');

@observer
class FilePicker extends React.Component {
    @observable canShare = false;
    constructor() {
        super();
        fileStore.loadAllFiles();
    }
    handleClose = () => this.props.onClose();
    handleShare = () => this.props.onShare();
    actions = [
        { label: 'Cancel', onClick: this.handleClose },
        { label: 'Share', onClick: this.handleShare, primary: true, disabled: !this.canShare }
    ];

    render() {
        return (
            <Dialog title="Share Files"
                    actions={this.actions}
                    active={this.props.active}
                    onEscKeyDown={this.handleClose}
                    onOverlayClick={this.handleClose}>
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
                    fileStore.files.map(f =>
                        <ListItem caption={f.name} leftIcon="check_box_outline_blank" />
                    )
                }
            </List>
        );
    }
}


module.exports = FilePicker;
