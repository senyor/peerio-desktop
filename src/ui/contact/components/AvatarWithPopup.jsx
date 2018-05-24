const React = require('react');
const { action, observable } = require('mobx');
const { observer } = require('mobx-react');

const { Avatar, Dialog } = require('peer-ui');
const ContactProfile = require('./ContactProfile');
const { t } = require('peerio-translator');

@observer
class AvatarWithPopup extends React.Component {
    @observable popupVisible;
    @action.bound openPopup() { this.popupVisible = true; }
    @action.bound closePopup() { this.popupVisible = false; }

    render() {
        const popup = (
            <Dialog
                active={this.popupVisible}
                key={`avatarwithpopup-dialog-${this.props.contact}`}
                onCancel={this.closePopup}
                actions={[{ label: t('button_ok'), onClick: () => this.closePopup() }]}
            >
                <ContactProfile
                    contact={this.props.contact}
                    onClose={this.closePopup}
                />
            </Dialog>
        );

        const avatar = (
            <Avatar
                key={`avatarwithpopup-avatar-${this.props.contact}`}
                onClick={this.openPopup}
                {...this.props}
            />
        );

        return [
            avatar,
            popup
        ];
    }
}

module.exports = AvatarWithPopup;
