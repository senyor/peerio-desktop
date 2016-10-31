const React = require('react');
const { Component } = require('react');
const { observable, autorunAsync, computed } = require('mobx');
const { observer } = require('mobx-react');
const { Input, Dropdown } = require('react-toolbox');
const { config, User } = require('../icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const languageStore = require('../stores/language-store');
const T = require('../components/T');

class ProfileStore {
    @observable username = undefined;
    @observable email ='';
    @observable firstName ='';
    @observable lastName ='';
    @observable usernameError = '';

    @computed get hasErrors() {
        const emptyFields = !this.email || !this.username || !this.firstName || !this.lastName;
        return emptyFields || (this.usernameError.length > 0);
    }
}

@observer class SignupProfile extends Component {
    constructor() {
        super();
        this.usernameUpdater = (val) => { this.props.store.username = val; };
        this.emailUpdater = (val) => { this.props.store.email = val; };
        this.firstNameUpdater = (val) => { this.props.store.firstName = val; };
        this.lastNameUpdater = (val) => { this.props.store.lastName = val; };
        // reaction validates username over server api
        autorunAsync(() => {
            if (this.props.store.username === undefined) return;
            User.validateUsername(this.props.store.username)
                .then(res => { this.props.store.usernameError = res ? '' : t('usernameNotAvailable'); });
        }, 100);
    }
    render() {
        const s = this.props.store;
        return (
            <div className="profile">
                <div className="signup-subtitle">{t('profile')}</div>
                <Input type="text" label={t('username')} error={s.usernameError}
                    value={s.username} onChange={this.usernameUpdater} />
                <Input type="text" label={t('email')}
                    value={s.email} onChange={this.emailUpdater} />
                <div className="input-row">
                    {/* TODO: Make fields optional. Add optional helper text. */}
                    <Input type="text" label={t('firstName')}
                        value={s.firstName} onChange={this.firstNameUpdater} />
                    <Input type="text" label={t('lastName')}
                        value={s.lastName} onChange={this.lastNameUpdater} />
                </div>
                <Dropdown value={languageStore.language}
                    source={languageStore.translationLangsDataSource} onChange={languageStore.changeLanguage} />
                <p>{t('signup_TOSRequestText',
                    {
                        emphasis: text => <strong>{text}</strong>,
                        tosLink: text => <a href={config.termsUrl}>{text}</a>
                    })}
                </p>
            </div>
        );
    }
}

module.exports = { SignupProfile, ProfileStore };
