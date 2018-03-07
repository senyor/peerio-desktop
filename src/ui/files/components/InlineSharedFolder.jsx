const React = require('react');
const { MaterialIcon } = require('~/peer-ui');
const { getFolderByEvent } = require('~/helpers/icebear-dom');
const { fileStore } = require('peerio-icebear');
const routerStore = require('~/stores/router-store');

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
                    <div className="shared-file">
                        <div className="container clickable">
                            <p>
                                <MaterialIcon icon="folder_shared" className="file-icon" onClick={this.click} />
                                <span className="clickable" onClick={this.click}>{folderName}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = InlineSharedFolder;
