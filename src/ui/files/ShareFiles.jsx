const React = require('react');
const { observer } = require('mobx-react');
const { fileStore, chatStore } = require('peerio-icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const routerStore = require('~/stores/router-store');

@observer
class ShareFiles extends React.Component {
    handleFileShareAccept = (users) => {
        const files = fileStore.getSelectedFiles();
        fileStore.clearSelection();
        const count = files.length;
        if (!count || !users.length) return;
        chatStore.startChatAndShareFiles(users, files).then(() => {
            routerStore.navigateTo(routerStore.ROUTES.chats);
        });
        this.closeUserPicker();
    };

    closeUserPicker = () => {
        window.router.goBack();
    };

    render() {
        return (
            <div className="create-new-chat share-files-userpicker">
                <UserPicker title={t('title_shareWith')} noDeleted
                    button={t('button_share')}
                    onAccept={this.handleFileShareAccept}
                    onClose={this.closeUserPicker}
                    sharing
                    limit={1}
                    closeable
                />
            </div>
        );
    }
}

module.exports = ShareFiles;
