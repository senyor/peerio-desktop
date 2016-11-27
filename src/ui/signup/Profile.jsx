const React = require('react');
const { Component } = require('react');
const { observable, autorunAsync, computed } = require('mobx');
const { observer } = require('mobx-react');
const { Dropdown } = require('react-toolbox');
const ValidatedInput = require('../shared-components/ValidatedInput');
const { config, User, socket, validation } = require('../../icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const languageStore = require('../../stores/language-store');
const T = require('../shared-components/T');

const { validators, validateField } = validation;


const profileStore = observable({
    @validateField(validators.username, 0) username: '',
    @validateField(validators.email, 1) email: '',
    @validateField(validators.firstName, 2) firstName: '',
    @validateField(validators.lastName, 3) lastName: '',

    @computed get hasErrors() {
        return !(this.usernameValid && this.emailValid &&
            this.firstNameValid && this.lastNameValid && socket.connected);
    }
});

@observer class Profile extends Component {

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    render() {
        const s = this.props.store;
        console.log(s);
        return (
            <div className="flex-col profile">
                <div className="signup-subtitle">{t('profile')}</div>
                <ValidatedInput label={t('username')}
                                name="username" store={s} />
                <ValidatedInput label={t('email')}
                                name="email" store={s} />
                <div className="input-row">
                    <div>
                        <ValidatedInput label={t('firstName')}
                                        name="firstName" store={s} />
                    </div>
                    <div>
                        <ValidatedInput label={t('lastName')}
                            name="lastName" store={s} />
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

module.exports = { Profile, profileStore };
