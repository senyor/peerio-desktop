const React = require('react');
const dragStore = require('~/stores/drag-drop-store');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, Dialog } = require('~/react-toolbox');
const { fileStore, chatStore } = require('~/icebear');

@observer
class DropTarget extends React.Component {
    @observable dialogActive = false;
    _files;

    componentWillMount() {
        dragStore.onFilesDropped(this.upload);
    }

    cancelUpload = () => {
        this.dialogActive = false;
        this._files = [];
    };

    upload = (files) => {
        if (this.dialogActive) return;
        this._files = files;
        if (window.router.getCurrentLocation().pathname === '/app' && chatStore.activeChat) {
            this.dialogActive = true;
            return;
        }
        this.justUpload(files);
    };

    justUpload = () => {
        this._files.forEach(f => { fileStore.upload(f); });
        this.dialogActive = false;
    };

    uploadAndShare = () => {
        this._files.forEach(f => { chatStore.activeChat.uploadAndShare(f); });
        this.dialogActive = false;
    };

    uploadActions = [
        { label: 'Just upload', onClick: this.justUpload },
        { label: 'Upload and share', onClick: this.uploadAndShare },
        { label: 'Cancel', onClick: this.cancelUpload }
    ];

    render() {
        if (this.dialogActive) {
            return (
                <Dialog
                  actions={this.uploadActions}
                  active
                  onEscKeyDown={this.cancelUpload}
                  onOverlayClick={this.cancelUpload}
                  title="My awesome dialog">
                    <p>Do u want to share file(s) with current chat or just upload?</p>
                </Dialog>
            );
        }

        if (!dragStore.hovering) return null;
        return (
            <div className="global-drop-target">
                <div className="drop-content">
                    <FontIcon value="cloud_upload" />
                    <div>
                        Drop {dragStore.hoveringFileCount} files to upload
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = DropTarget;
