const React = require('react');
const { Component } = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { Dropdown } = require('~/react-toolbox');
const ValidatedInput = require('~/ui/shared-components/ValidatedInput');
const { socket, validation } = require('~/icebear');
const { t } = require('peerio-translator');
const languageStore = require('~/stores/language-store');
const OrderedFormStore = require('~/stores/ordered-form-store');

const { validators } = validation; // use common validation from core

class ProfileStore extends OrderedFormStore {
    @observable fieldsExpected = 2;

    @observable username = ''; // also has observables usernameValid, usernameDirty
    @observable email = ''; // also has emailValid, emailDirty
    @observable firstName = ''; // etc
    @observable lastName = ''; // etc

    @computed get hasErrors() {
        return !(this.initialized && this.usernameValid && this.emailValid &&
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
        return (
            <div className="flex-col profile">
			<div className="signup-title">{t('title_signupStep1')}</div>
                <div className="signup-subtitle">{t('title_settingsProfile')}</div>
                <ValidatedInput label={t('title_username')}
                                value={this.props.store.username}
                                position="0"
                                lowercase="true"
                                validator={validators.username}
                                maxLength={16}
                                name="username"
                                store={this.props.store}
                                hint={t('title_hintUsername')}/>
                {/* a-Z, 0-9, and _ only. */}

                <ValidatedInput label={t('title_email')}
                                position="1"
                                lowercase="true"
                                validator={validators.email}
                                name="email"
                                store={this.props.store}
                                hint={t('title_hintEmail')}/>
                {/* "ex. info@peerio.com" */}
                <div className="input-row">
                    <div>
                        <ValidatedInput label={t('title_firstName')}
                                        position="2"
                                        validator={validators.firstName}
                                        name="firstName"
                                        store={this.props.store} />
                    </div>
                    <div>
                        <ValidatedInput label={t('title_lastName')}
                                        position="3"
                                        validator={validators.lastName}
                                        name="lastName"
                                        onKeyPress={this.handleKeyPress}
                                        store={this.props.store} />
                    </div>
                </div>
                <Dropdown value={languageStore.language}
                    source={languageStore.translationLangsDataSource} onChange={languageStore.changeLanguage} />
            </div>
        );
    }
}

module.exports = { Profile, ProfileStore };
