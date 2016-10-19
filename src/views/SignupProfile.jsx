const React = require('react');
const { Component } = require('react');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { Input, Dropdown } = require('react-toolbox');
const { pCrypto, config, User, errors } = require('../icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const languageStore = require('../stores/language-store');

class ProfileStore {
    @observable username: string = undefined;
    @observable email: string ='';
    @observable firstName: string ='';
    @observable lastName: string ='';
    @observable usernameError: string = '';
}

@observer class SignupProfile extends Component {
    constructor() {
        super();
        this.usernameUpdater = (val: string) => { this.props.store.username = val; };
        this.emailUpdater = (val: string) => { this.props.store.email = val; };
        this.firstNameUpdater = (val: string) => { this.props.store.firstName = val; };
        this.lastNameUpdater = (val: string) => { this.props.store.lastName = val; };
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
            <Input type="text" className="login-input" label={t('username')} error={s.usernameError}
                value={s.username} onChange={this.usernameUpdater} />
            <Input type="text" className="login-input" label={t('email')}
                value={s.email} onChange={this.emailUpdater} />
            <Input type="text" className="login-input" label={t('firstName')}
                value={s.firstName} onChange={this.firstNameUpdater} />
            <Input type="text" className="login-input" label={t('lastName')}
                value={s.lastName} onChange={this.lastNameUpdater} />

            <Dropdown className="login-input" value={languageStore.language}
                source={languageStore.translationLangsDataSource} onChange={languageStore.changeLanguage} />

            <div className="signup-terms">
              {t('signup_TOSRequestText', { tosLink: text => <a href={config.termsUrl}>{text}</a> })}
            </div>
          </div>
        );
    }
}

module.exports = { SignupProfile, ProfileStore };
