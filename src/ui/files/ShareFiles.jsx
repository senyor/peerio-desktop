const React = require('react');
const { observer } = require('mobx-react');
const { fileStore } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');

@observer
class ShareFiles extends React.Component {

    handleFileShareAccept = (users) => {
        fileStore.shareSelectedFiles(users);
        this.closeUserPicker();
    };

    closeUserPicker = () => {
        window.router.push('/app/files');
    };

    render() {
        return (
            <div className="create-new-chat">
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
