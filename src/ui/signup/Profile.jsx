const React = require('react');
const { Component } = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { Dropdown } = require('react-toolbox');
const ValidatedInput = require('../shared-components/ValidatedInput');
const { config, User, socket, validation } = require('../../icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const languageStore = require('../../stores/language-store');
const T = require('../shared-components/T');
const OrderedFormStore = require('../../stores/ordered-form-store');

const { validators } = validation; // use common validation from core

class ProfileStore extends OrderedFormStore {
    @observable username = ''; // also has observables usernameValid, usernameDirty
    @observable email = ''; // also has emailValid, emailDirty
    @observable firstName = ''; // etc
    @observable lastName = ''; // etc

    @computed get hasErrors() {
        return !(this.usernameValid && this.emailValid &&
            this.firstNameValid && this.lastNameValid && socket.connected);
    }
}

@observer class Profile extends Component {

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    render() {
        const s = this.props.store;
        return (
            <div className="flex-col profile">
                <div className="signup-subtitle">{t('profile')}</div>
                <ValidatedInput label={t('username')}
                                position="0"
                                validator={validators.username}
                                name="username"
                                store={s} />

                <ValidatedInput label={t('email')}
                                position="1"
                                validator={validators.email}
                                name="email"
                                store={s} />

                <div className="input-row">
                    <div>
                        <ValidatedInput label={t('firstName')}
                                        position="2"
                                        validator={validators.firstName}
                                        name="firstName"
                                        store={s} />
                    </div>
                    <div>
                        <ValidatedInput label={t('lastName')}
                                        position="3"
                                        validator={validators.lastName}
                                        name="lastName"
                                        onKeyPress={this.handleKeyPress}
                                        store={s} />
                    </div>
                </div>
                <Dropdown value={languageStore.language}
                    source={languageStore.translationLangsDataSource} onChange={languageStore.changeLanguage} />

                <T k="signup_TOSRequestText" className="terms">
                    {{
                        emphasis: text => <strong>{text}</strong>,
                        tosLink: text => <a href={config.termsUrl}>{text}</a>
                    }}
                </T>
            </div>
        );
    }
}

module.exports = { Profile, ProfileStore };
