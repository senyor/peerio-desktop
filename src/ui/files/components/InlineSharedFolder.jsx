const React = require('react');
const { action, observable } = require('mobx');
const { observer } = require('mobx-react');

const { fileStore } = require('peerio-icebear');
const routerStore = require('~/stores/router-store');
const { getFolderByEvent } = require('~/helpers/icebear-dom');
const css = require('classnames');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');

const { Button, MaterialIcon } = require('~/peer-ui');
const SharedFolderActions = require('./SharedFolderActions');

@observer
class InlineSharedFolder extends React.Component {
    @observable isShared = true;

    click = (ev) => {
        const folder = getFolderByEvent(ev);
        if (folder) {
            fileStore.folders.currentFolder = folder;
            routerStore.navigateTo(routerStore.ROUTES.files);
        }
    }

    shareFolder = () => {
        console.log('share folder');
    }

    @action.bound async downloadFolder() {
        console.log('download folder');

        // from Files.jsx:
        // const folder = getFolderByEvent(ev);
        // const path = await selectFolder();
        // if (!path) return;
        // fileStore.bulk.downloadOne(folder, path);
    }

    @action.bound unshareFolder() {
        console.log('unshare folder');
        this.isShared = false;
    }

    deleteFolder = () => {
        console.log('delete shared folder');
    }

    @action.bound reshareFolder() {
        console.log('reshare folder');
        this.isShared = true;
    }

    render() {
        const { folderName, folderId } = this.props;
        return (
            <div data-folderid={folderId}
                className={css(
                    'inline-files-container',
                    'inline-shared-folder-container',
                    { unshared: !this.isShared }
                )}
            >
                <div className="inline-files">
                    <div className="shared-file inline-files-topbar">
                        <div className="container">
                            <div className="file-name-container clickable"
                                onClick={this.click}
                            >
                                <div className="file-icon">
                                    <MaterialIcon icon={this.isShared ? 'folder_shared' : 'folder'} />
                                </div>
                                <div className="file-name">
                                    {this.isShared
                                        ? folderName
                                        : <T k="title_folderNameUnshared">{{ folderName }}</T>
                                    }
                                </div>
                            </div>
                            {this.isShared
                                ? <SharedFolderActions
                                    onShare={this.shareFolder}
                                    onDownload={this.downloadFolder}
                                    onUnshare={this.unshareFolder}
                                    onDelete={this.deleteFolder}
                                />
                                : <Button
                                    label={t('button_reshare')}
                                    onClick={this.reshareFolder}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = InlineSharedFolder;
