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
    @observable emailError = undefined;

    @computed get hasErrors() {
        const emptyFields = !this.email || !this.username || !this.firstName || !this.lastName;
        return !!(emptyFields || (this.usernameError) || this.emailError);
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
        autorunAsync(() => this.validate(), 100);
    }

    validate() {
        if (this.props.store.username === undefined) return false;
        if (this.props.store.email && !this.props.store.email.match(/.+@.+\..+/)) {
            this.props.store.emailError = t('signup_emailError');
        } else {
            this.props.store.emailError = undefined;
        }
        this.props.store.username = this.props.store.username.toLowerCase();
        if (this.props.store.username) {
            return User.validateUsername(this.props.store.username)
                .then(res => {
                    this.props.store.usernameError = res ? undefined : t('usernameNotAvailable');
                });
        }
        return Promise.resolve();
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    render() {
        const s = this.props.store;
        return (
            <div className="profile">
                <div className="signup-subtitle">{t('profile')}</div>
                <Input type="text" label={t('username')} error={s.usernameError}
                    value={s.username} onChange={this.usernameUpdater} />
                <Input type="text" label={t('email')}
                    value={s.email} error={s.emailError} onChange={this.emailUpdater} />
                <div className="input-row">
                    {/* TODO: Make fields optional. */}
                    <div>
                        <Input type="text" label={t('firstName')}
                            value={s.firstName} onChange={this.firstNameUpdater} />
                    </div>
                    <div>
                        <Input type="text" label={t('lastName')}
                            value={s.lastName} onChange={this.lastNameUpdater} onKeyPress={this.handleKeyPress} />
                    </div>
                </div>
                <Dropdown value={languageStore.language}
                    source={languageStore.translationLangsDataSource} onChange={languageStore.changeLanguage} />

                <T k="signup_TOSRequestText" className="signup-terms">
                    {{
                        emphasis: text => <strong>{text}</strong>,
                        tosLink: text => <a href={config.termsUrl}>{text}</a>
                    }}
                </T>
            </div>
        );
    }
}

module.exports = { SignupProfile, ProfileStore };
