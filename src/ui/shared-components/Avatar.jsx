const React = require('react');
const { observer } = require('mobx-react');
const RTAvatar = require('~/react-toolbox').Avatar;
const { FontIcon } = require('~/react-toolbox');
const uiStore = require('~/stores/ui-store');
const { contactStore } = require('~/icebear');
// todo: cache avatar component for every contact?
@observer
class Avatar extends React.Component {
    openContactDialog = () => {
        uiStore.contactDialogUsername = this.props.contact ? this.props.contact.username : this.props.username;
    };
    render() {
        const contact = this.props.contact || contactStore.getContact(this.props.username);
        const style = { backgroundColor: contact.color };
        if (this.props.size) {
            switch (this.props.size) {
                case 'tiny': style.zoom = '0.5'; break;
                default: break;
            }
        }
        return (
            <div className="avatar-wrapper">
                <RTAvatar style={style} title={contact.firstName}
                          onClick={this.openContactDialog} className="clickable-avatar" />
                {contact.tofuError ?
                    <FontIcon value="error" />
                    : null}
            </div>
        );
    }
}

module.exports = Avatar;
