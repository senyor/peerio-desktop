const React = require('react');
const dragStore = require('~/stores/drag-drop-store');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { MaterialIcon } = require('peer-ui');
const { fileStore, chatStore } = require('peerio-icebear');
const { t } = require('peerio-translator');
const routerStore = require('~/stores/router-store');
const UploadDialog = require('../shared-components/UploadDialog');

@observer
class DropTarget extends React.Component {
    @observable dialogActive = false;
    @observable _files;

    componentWillMount() {
        dragStore.onFilesDropped(this.fileDropHandler);
    }

    fileDropHandler = (list) => {
        if (this.dialogActive || list.success.length === 0) return;
        this._files = list;
        if (routerStore.currentRoute === routerStore.ROUTES.chats && chatStore.activeChat) {
            this.dialogActive = true;
            return;
        }
        let folder = null;
        if (routerStore.currentRoute === routerStore.ROUTES.files) {
            folder = fileStore.folders.currentFolder;
        }
        this.justUpload(folder);
    };

    justUpload = (folder) => {
        this._files.success.forEach(
            f => fileStore.upload(f, null, folder ? folder.folderId : null)
        );
        this.dialogActive = false;
    };

    dialogDeactivate() {
        this.dialogActive = false;
        this._files = [];
    }

    render() {
        if (this.dialogActive) {
            return (
                <UploadDialog
                    deactivate={() => this.dialogDeactivate()}
                    files={this._files.success}
                />
            );
        }

        if (!dragStore.hovering) return null;
        return (
            <div className="global-drop-target">
                <div className="drop-content">
                    <MaterialIcon icon="cloud_upload" />
                    <div className="display-2">
                        {t('title_dropToUpload', { count: ''/* dragStore.hoveringFileCount */ })}
                        <div className="display-1">{/* util.formatBytes(dragStore.hoveringFileSize) */}</div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = DropTarget;
