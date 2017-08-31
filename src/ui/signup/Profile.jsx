const React = require('react');
const { Component } = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon } = require('~/react-toolbox');
const ValidatedInput = require('~/ui/shared-components/ValidatedInput');
const { socket, validation, PhraseDictionary } = require('~/icebear');
const { t } = require('peerio-translator');
const OrderedFormStore = require('~/stores/ordered-form-store');

const { validators } = validation; // use common validation from core

class ProfileStore extends OrderedFormStore {
    @observable fieldsExpected = 2;

    @observable username = ''; // also has observables usernameValid, usernameDirty
    @observable email = ''; // also has emailValid, emailDirty
    @observable firstName = ''; // etc
    @observable lastName = ''; // etc
    @observable passphrase = '';

    rerollPassphrase() {
        this.passphrase = PhraseDictionary.current.getPassphrase(8);
    }

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
            <div className="signup-form">
                <div className="profile">
                    <div className="avatar-input">
                        <FontIcon value="add" />
                        <div className="avatar-instructions">
                            Add photo
                        </div>
                        <div className="caption">(optional)</div>
                    </div>
                    <div className="test-first">
                        <ValidatedInput label={t('title_firstName')}
                            position="2"
                            validator={validators.firstName}
                            name="firstName"
                            store={this.props.store} />
                    </div>
                    <div className="test-second">
                        <ValidatedInput label={t('title_lastName')}
                            position="3"
                            validator={validators.lastName}
                            name="lastName"
                            onKeyPress={this.handleKeyPress}
                            store={this.props.store} />
                    </div>
                    <ValidatedInput label={t('title_username')}
                        position="0"
                        lowercase="true"
                        validator={validators.username}
                        maxLength={16}
                        name="username"
                        store={this.props.store}
                        hint={t('title_hintUsername')} />
                    {/* a-Z, 0-9, and _ only. */}

                    <ValidatedInput label={t('title_email')}
                        position="1"
                        lowercase="true"
                        validator={validators.email}
                        name="email"
                        store={this.props.store}
                        hint={t('title_hintEmail')} />
                    {/* "ex. info@peerio.com" */}
                </div>
            </div>
        );
    }
}

module.exports = { Profile, ProfileStore };
