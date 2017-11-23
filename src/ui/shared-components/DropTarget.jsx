const React = require('react');
const dragStore = require('~/stores/drag-drop-store');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, Dialog } = require('~/react-toolbox');
const { fileStore, chatStore } = require('~/icebear');
const { t } = require('peerio-translator');
const routerStore = require('~/stores/router-store');
const uiStore = require('../../stores/ui-store');

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

    upload = (list) => {
        if (this.dialogActive || list.success.length === 0) return;
        this._files = list;
        if (routerStore.currentRoute === routerStore.ROUTES.chats && chatStore.activeChat) {
            this.dialogActive = true;
            return;
        }
        let folder = null;
        if (routerStore.currentRoute === routerStore.ROUTES.files) {
            folder = uiStore.currentFolder;
        }
        this.justUpload(folder);
    };

    justUpload = (folder) => {
        const promises = [];
        this._files.success.forEach(f => {
            const file = fileStore.upload(f);
            if (folder) {
                promises.push(new Promise(resolve =>
                    when(() => file.fileId, () => {
                        folder.moveInto(file);
                        resolve();
                    })));
            }
        });
        this.dialogActive = false;
    };

    uploadAndShare = () => {
        this._files.success.forEach(f => void chatStore.activeChat.uploadAndShareFile(f));
        this.dialogActive = false;
    };


    render() {
        if (this.dialogActive) {
            const uploadActions = [
                { label: t('button_cancel'), onClick: this.cancelUpload },
                { label: t('button_upload'), onClick: this.uploadAndShare }
            ];

            return (
                <Dialog
                    actions={uploadActions}
                    active
                    onEscKeyDown={this.cancelUpload}
                    onOverlayClick={this.cancelUpload}
                    title={t('title_uploadAndShare')}>
                    <p>{t('title_fileWillBeShared',
                        {
                            chatName: chatStore.activeChat.isChannel
                                ? `# ${chatStore.activeChat.name}`
                                : chatStore.activeChat.name
                        }
                    )}
                    </p>
                </Dialog>
            );
        }

        if (!dragStore.hovering) return null;
        return (
            <div className="global-drop-target">
                <div className="drop-content">
                    <FontIcon value="cloud_upload" />
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
