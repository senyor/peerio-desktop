const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Input } = require('~/react-toolbox');
const { User, contactStore } = require('~/icebear');
const { t } = require('peerio-translator');
const BetterInput = require('~/ui/shared-components/BetterInput');

@observer
class Profile extends React.Component {
    // @observable avatarImage = 'url(http://placekitten.com/512/512)';
    @observable initial = User.current.firstName.slice(0, 1);

    componentWillMount() {
        this.contact = contactStore.getContact(User.current.username);
    }

    // handleDeleteAvatar = () => {
    //     this.avatarImage = '';
    // }
    //
    // handleAddAvatar = () => {
    //   this.avatarImage = 'url(http://placekitten.com/512/512)';
    // }
    r
    esend = () => {
        // TODO: this should resend email
        console.log('EMAIL SENT!');
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

    render() {
        // if (u.loading) return null; // todo: spinner
        const f = this.contact.fingerprint.split('-');

        return (
            <section className="flex-row">
                <div>
                    <div className="input-row">
                        <BetterInput onAccept={this.saveFirstName}
                            label={t('title_firstName')}
                            value={User.current.firstName} />
                        <BetterInput onAccept={this.saveLastName}
                            label={t('title_lastName')}
                            value={User.current.lastName} />
                    </div>
                    <div className="input-row">
                        <div className="flex-col">
                            <Input type="email" label={t('title_email')} value={User.current.primaryAddress} />
                            {
                                User.current.primaryAddressConfirmed
                                    ? null
                                    : <div className="error">{t('error_unconfirmedEmail')}</div>
                            }
                        </div>
                        {/* User.current.primaryAddressConfirmed ? null :
                        <Button label={t('button_resend')}
                                // 46px because of 40px margin on top of input
                                // and 6px margin around buttons.
                                style={{ marginTop: '46px' }}
                                flat primary />*/}
                    </div>
                    <div className="input-row">
                        {/*
                            This will probably be a custom input.
                            The current plan  for phone numbers is that when the
                            user clicks the country code are it will open a
                            dropdown. The input is designed to look like one
                            single solitary individual all alone by itself with
                            nothing else...input.
                        */}
                        {/* TODO: INPUT MASK FOR THE PRETTIEST PHONE NUMBERS */}
                        {/* <Input type="tel" label={t('title_phone')} />*/}
                    </div>

                    <div className="row" style={{ marginTop: '40px' }} >
                        <div className="list-title" style={{ marginBottom: '8px' }}> {t('title_publicKey')}</div>
                        <div className="monospace">{f[0]} {f[1]} {f[2]}</div>
                        <div className="monospace">{f[3]} {f[4]} {f[5]}</div>
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
                            {User.current.firstName} {User.current.lastName}
                        </div>
                        <div className="avatar-card-username">
                            {User.current.username}
                        </div>
                    </div>
                    <div className="avatar-card-initial">
                        {/* {this.avatarImage ? '' : this.initial} */}
                        {this.initial}
                    </div>
                    <div className="card-footer">
                        {/* <IconButton icon="delete"
                                    className={css({ banish: !this.avatarImage })}
                                    onClick={this.handleDeleteAvatar} />
                        <IconButton icon="add_a_photo"
                                    onClick={this.handleAddAvatar} /> */}
                    </div>
                </div>
            </section>
        );
    }
}
module.exports = Profile;
