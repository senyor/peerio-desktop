import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { fileStore, chatStore, t } from 'peerio-icebear';
import { FileFolder } from 'peerio-icebear/dist/models';
import { MaterialIcon } from 'peer-ui';

import routerStore from '~/stores/router-store';
import DragDrop from '../shared-components/DragDrop';
import UploadDialog from '../shared-components/UploadDialog';
import { FileTree, FileList } from '~/helpers/file';

@observer
export default class DropTarget extends React.Component {
    @observable dialogActive = false;
    @observable _files: string[];

    fileDropHandler = (list: FileList, trees: FileTree[]) => {
        if (this.dialogActive || list.success.length === 0) return;
        this._files = list.success;
        if (routerStore.currentRoute === routerStore.ROUTES.chats && chatStore.activeChat) {
            this.dialogActive = true;
            return;
        }
        let folder = null;
        if (routerStore.currentRoute === routerStore.ROUTES.files) {
            folder = fileStore.folderStore.currentFolder;
        }
        this.justUpload(trees, folder);
    };

    justUpload = async (trees: FileTree[], folder: FileFolder) => {
        await Promise.map<FileTree, any>(trees, tree => {
            if (typeof tree === 'string') {
                return fileStore.upload(tree, null, folder);
            }
            return fileStore.uploadFolder(tree, folder);
        });
        this.dialogActive = false;
    };

    dialogDeactivate() {
        this.dialogActive = false;
        this._files = [];
    }

    render() {
        if (routerStore.currentRoute === routerStore.ROUTES.files) return null;

        return (
            <DragDrop onDrop={this.fileDropHandler}>
                {({ hovering, preparingForUpload }) => {
                    if (this.dialogActive || preparingForUpload) {
                        return (
                            <UploadDialog
                                deactivate={() => this.dialogDeactivate()}
                                files={this._files}
                            />
                        );
                    }

                    if (!hovering) return null;

                    return (
                        <div className="global-drop-target">
                            <div className="drop-content">
                                <MaterialIcon icon="cloud_upload" />
                                <div className="display-2">
                                    {t('title_dropToUpload', {
                                        count: '' /* dragStore.hoveringFileCount */
                                    })}
                                    <div className="display-1">
                                        {/* util.formatBytes(dragStore.hoveringFileSize) */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </DragDrop>
        );
    }
}
