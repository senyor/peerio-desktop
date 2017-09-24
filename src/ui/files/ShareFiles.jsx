const React = require('react');
const { observer } = require('mobx-react');
const { fileStore, chatStore } = require('~/icebear');
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
        window.router.back();
    };

    render() {
        return (
            <div className="create-new-chat">
                <UserPicker title={t('title_shareWith')} noDeleted
                    button={t('button_share')}
                    onAccept={this.handleFileShareAccept}
                    onClose={this.closeUserPicker}
                    sharing />
            </div>
        );
    }
}

module.exports = ShareFiles;
