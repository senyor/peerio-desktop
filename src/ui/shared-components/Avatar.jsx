const React = require('react');
const { observer } = require('mobx-react');
const RTAvatar = require('~/react-toolbox').Avatar;
const uiStore = require('~/stores/ui-store');

// todo: cache avatar component for every contact?
@observer
class Avatar extends React.Component {
    openContactDialog = () => {
        uiStore.contactDialogUsername = this.props.contact.username;
    };
    render() {
        return (
            <RTAvatar style={{ backgroundColor: this.props.contact.color }} title={this.props.contact.username}
                      onClick={this.openContactDialog} className="clickable-avatar" />
        );
    }
}

module.exports = Avatar;
