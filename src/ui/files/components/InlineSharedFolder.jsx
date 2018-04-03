const React = require('react');
const { MaterialIcon } = require('~/peer-ui');
const { getFolderByEvent } = require('~/helpers/icebear-dom');
const { fileStore } = require('peerio-icebear');
const routerStore = require('~/stores/router-store');

const FolderActions = require('./FolderActions');

class InlineSharedFolder extends React.Component {
    click = (ev) => {
        const folder = getFolderByEvent(ev);
        if (folder) {
            fileStore.folders.currentFolder = folder;
            routerStore.navigateTo(routerStore.ROUTES.files);
        }
    }

    render() {
        const { folderName, folderId } = this.props;
        return (
            <div className="inline-files-container" data-folderid={folderId}>
                <div className="inline-files">
                    <div className="shared-file inline-files-topbar">
                        <div className="container">
                            <div className="file-name-container clickable"
                                onClick={this.click}
                            >
                                <div className="file-icon">
                                    <MaterialIcon icon="folder_shared" className="file-icon" />
                                </div>
                                <div className="file-name">{folderName}</div>
                            </div>
                            <FolderActions />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = InlineSharedFolder;
