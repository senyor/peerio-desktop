const React = require('react');
const { Component } = require('react');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { Input, Dropdown } = require('react-toolbox');
const { pCrypto, config, User, errors } = require('../icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const languageStore = require('../stores/language-store');
const T = require('../components/T');
const storage = require('./tiny-db');


class PasscodeStore {
    @observable passcode;
    @observable passcodeRepeat;
    @observable passcodeError;
    @observable repeatError;

    setPasscode(passcodeString) {
        return User.getPasscodeSecret(passcodeString)
            .then((passcodeSecret) => {
                storage.set(`${this.user.username}:passcode`, passcodeSecret)
            })
    }
}

@observer class SignupPasscode extends Component {
    constructor() {
        super();

        autorunAsync(() => {
            if (this.props.store.passcode === undefined) return;
            if (this.props.store.passcode !== this.props.store.passcodeRepeat)
            User.validatePassword(this.props.store.passcode)
        })
    }

    /**
     *
     * @param val
     */
    passcodeUpdater(val) {
        this.props.store.passcode = val;
    }

    /**
     *
     * @param val
     */
    passcodeRepeatUpdater(val) {
        this.props.store.passcodeRepeat = val;
    }

    
    render() {
        const s = this.props.store;
        return (
            <div className="passcode">
                <div className="signup-subtitle">{t('passcode')}</div>
                <Input type="text" className="login-input" label={t('passcode')} error={s.passwordError}
                       value={s.passcode} onChange={this.passcodeUpdater} />
                <Input type="text" className="login-input" label={t('passcodeRepeat')} error={s.repeatError}
                       value={s.passcodeRepeat} onChange={this.passcodeRepeatUpdater}  />
                \
            </div>
        );
    }
}

module.exports = {SignupPasscode, PasscodeStore };
