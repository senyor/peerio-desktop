const React = require('react');
const { observer } = require('mobx-react');
const { fileStore } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');

@observer
class ShareFiles extends React.Component {

    handleFileShareAccept = (users) => {
        const files = fileStore.getSelectedFiles();
        fileStore.clearSelection();
        users.forEach(username => {
            files.forEach(file => {
                file.share(username);
            });
        });
        this.closeUserPicker();
    };

    closeUserPicker = () => {
        window.router.push('/app/files');
    };

    render() {
        return (
            <div className="create-new-message">
                <UserPicker title={t('title_shareWith')}
                    button={t('button_share')}
                    onAccept={this.handleFileShareAccept}
                    onClose={this.closeUserPicker}
                    sharing />
            </div>
        );
    }
}

module.exports = ShareFiles;
