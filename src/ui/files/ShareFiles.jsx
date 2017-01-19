const React = require('react');
const { Checkbox } = require('~/react-toolbox');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { fileStore, chatStore } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');

@observer
class ShareFiles extends React.Component {

    handleFileShareAccept = (users) => {
        // todo replace this with new sharing api when server implements it
        const chat = chatStore.startChat(users);
        const files = fileStore.getSelectedFiles();
        fileStore.clearSelection();
        when(() => !chat.loadingMeta, () => chat.sendMessage('', files));
        this.closeUserPicker();
    };

    closeUserPicker = () => {
        window.router.push('/app/files');
    };

    render() {
        return (
            <div className="create-new-message">
                <UserPicker title={`Select recipients for ${fileStore.selectedCount} file(s)`}
                            button="Share"
                            onAccept={this.handleFileShareAccept}
                            onClose={this.closeUserPicker}
                            sharing />
            </div>
        );
    }
}

module.exports = ShareFiles;
