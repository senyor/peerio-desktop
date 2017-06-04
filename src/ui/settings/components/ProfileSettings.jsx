const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Input, List, ListItem, TooltipIconButton, IconButton } = require('~/react-toolbox');
const { User, contactStore, validation } = require('~/icebear');
const { t } = require('peerio-translator');
const BetterInput = require('~/ui/shared-components/BetterInput');
const css = require('classnames');
const electron = require('electron').remote;
const AvatarEditor = require('./AvatarEditor');

@observer
class Profile extends React.Component {
    @observable addMode = false;
    @observable newEmail = '';
    @observable newEmailValid = false;
    @observable showAvatarEditor = false;

    componentWillMount() {
        this.contact = contactStore.getContact(User.current.username);
    }

    saveFirstName(val) {
        const prev = User.current.firstName;
        User.current.firstName = val;
        User.current.saveProfile().catch(() => {
            User.current.firstName = prev;
        });
    }

    saveLastName(val) {
        const prev = User.current.lastName;
        User.current.lastName = val;
        User.current.saveProfile().catch(() => {
            User.current.lastName = prev;
        });
    }
    // avatar ------
    handleAddAvatar = () => {
        const win = electron.getCurrentWindow();
        electron.dialog.showOpenDialog(win, {
            properties: ['openFile'],
            filters: [{ name: t('title_images'), extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] }]
        }, files => {
            if (!files || !files.length) return;
            this.newAvatarFile = files[0];
            this.showAvatarEditor = true;
        });
    }
    closeAvatarEditor = () => {
        this.showAvatarEditor = false;
    }
    saveAvatar = (blobs) => {
        console.debug(blobs);
        this.showAvatarEditor = false;
    };

    // ----- Emails -----
    switchToAddMode = () => {
        this.newEmail = '';
        this.addMode = true;
    };

    onNewEmailChange = (val, isValid) => {
        this.newEmail = val;
        this.newEmailValid = isValid;
    };

    onNewEmailAccept = (val, isValid) => {
        this.newEmail = val;
        this.newEmailValid = isValid;
        this.saveNewEmail();
    }

    cancelNewEmail = () => {
        this.addMode = false;
        this.newEmailValid = false;
        this.newEmail = '';
    };

    saveNewEmail = () => {
        if (this.newEmail && this.newEmailValid) User.current.addEmail(this.newEmail);
        this.cancelNewEmail();
    };

    removeEmail(email) {
        if (!confirm(`${t('title_confirmRemoveEmail')} ${email}`)) return;
        User.current.removeEmail(email);
    }

    resendConfirmation(email) {
        User.current.resendEmailConfirmation(email);
    }

    makePrimary(email) {
        User.current.makeEmailPrimary(email);
    }

    renderButton(a) {
        return (
            !a.confirmed && !a.primary
                ? <div>
                    <TooltipIconButton tooltip={t('button_resend')} icon="mail"
                        onClick={() => { this.resendConfirmation(a.address); }} />
                    <TooltipIconButton tooltip={t('button_delete')} icon="delete"
                        onClick={() => { this.removeEmail(a.address); }} />
                </div>
                : null);
    }

    renderPrimaryEmail(a) {
        return (
            a.primary
                ? t('title_primaryEmail')
                : null);
    }

    // ------ /Emails -----
    render() {
        const f = this.contact.fingerprint.split('-');
        const user = User.current;
        if (this.showAvatarEditor) {
            return (<section className="flex-row">
                <AvatarEditor file={this.newAvatarFile} onClose={this.closeAvatarEditor}
                    onSave={this.saveAvatar} />
            </section>);
        }
        return (
            <section className="flex-row">
                <div>
                    <div className="input-row">
                        <BetterInput onAccept={this.saveFirstName}
                            label={t('title_firstName')}
                            value={user.firstName} />
                        <BetterInput onAccept={this.saveLastName}
                            label={t('title_lastName')}
                            value={user.lastName} />
                    </div>
                    <div className="dark-label"
                        style={{
                            height: '24px',
                            lineHeight: '48px',
                            paddingLeft: '12px',
                            marginBottom: '-8px'
                        }}>
                        {t('title_email')}
                    </div>
                    <List>
                        {
                            user.addresses.map(a => {
                                return (<ListItem key={a.address}
                                    className={css('email-row', { unconfirmed: !a.confirmed })}
                                    caption={a.address}
                                    legend={a.confirmed
                                        ? this.renderPrimaryEmail(a)
                                        : t('error_unconfirmedEmail')}
                                    leftIcon={a.primary && user.addresses.length > 1
                                        ? 'radio_button_checked'
                                        : <TooltipIconButton
                                            tooltip={t('button_makePrimary')} icon="radio_button_unchecked"
                                            onClick={() => { this.makePrimary(a.address); }} />}
                                    rightIcon={
                                        a.confirmed && !a.primary
                                            ? <TooltipIconButton tooltip={t('button_delete')} icon="delete"
                                                onClick={() => { this.removeEmail(a.address); }} />
                                            : this.renderButton(a)
                                    }
                                />);
                            })
                        }
                    </List>
                    {
                        this.addMode
                            ? <div className="flex-row">
                                <BetterInput type="email" label={t('title_email')} acceptOnBlur="false"
                                    validator={validation.validators.emailFormat.action}
                                    onChange={this.onNewEmailChange} value={this.newEmail} error="error_invalidEmail"
                                    onAccept={this.onNewEmailAccept} onReject={this.cancelNewEmail} />
                                <TooltipIconButton tooltip={t('button_save')} icon="done"
                                    onClick={this.saveNewEmail} disabled={!this.newEmailValid} />
                                <TooltipIconButton tooltip={t('button_cancel')} icon="cancel"
                                    onClick={this.cancelNewEmail} />
                            </div>
                            : null
                    }
                    {
                        this.addMode || user.addresses.length > 2
                            ? null
                            : <Button label={t('button_addEmail')} onClick={this.switchToAddMode} primary />
                    }

                    <div className="row" style={{ marginTop: '40px' }} >
                        <div className="list-title" style={{ marginBottom: '8px' }}> {t('title_publicKey')}</div>
                        <div className="monospace selectable">{f[0]} {f[1]} {f[2]}</div>
                        <div className="monospace selectable">{f[3]} {f[4]} {f[5]}</div>
                    </div>
                    {/* <Button label={t('button_save')}
                            style={{ marginTop: '40px' }} primary raised /> */}
                </div>
                <div className="avatar-card"
                    style={{
                        backgroundColor: this.contact.color
                        // backgroundImage: this.avatarImage
                    }}>
                    <div className="avatar-card-user">
                        <div className="avatar-card-display-name">
                            {user.fullName}
                        </div>
                        <div className="avatar-card-username">
                            {user.username}
                        </div>
                    </div>
                    <div className="avatar-card-initial">
                        {/* {this.avatarImage ? '' : this.contact.letter} */}
                        {this.contact.letter}
                    </div>
                    <div className="card-footer">
                        <IconButton icon="delete"
                            className={css({ banish: false })}
                            onClick={this.handleDeleteAvatar} />
                        <IconButton icon="add_a_photo"
                            onClick={this.handleAddAvatar} />
                    </div>
                </div>
            </section>
        );
    }
}
module.exports = Profile;
