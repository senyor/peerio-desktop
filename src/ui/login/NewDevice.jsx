const React = require('react');
const { Button, Dialog } = require('~/react-toolbox');
const { User, systemWarnings } = require('~/icebear');
const { observable, computed, action } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const css = require('classnames');
const languageStore = require('~/stores/language-store');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');
const { Passcode, PasscodeStore } = require('../signup/Passcode');
const Snackbar = require('~/ui/shared-components/Snackbar');
const T = require('~/ui/shared-components/T');

@observer class NewDevice extends React.Component {
    @observable busy = false;

    passcodeStore = new PasscodeStore();

    constructor() {
        super();
        this.createPasscode = this.createPasscode.bind(this);
    }

    /**
     * Disallow user's names.
     */
    componentDidMount() {
        this.passcodeStore.addToBanList([
            User.current.username,
            User.current.firstName,
            User.current.lastName
        ]);
    }

    /**
     * Set passcode.
     *
     * @returns {Promise}
     */
    @action createPasscode() {
        if (this.passcodeStore.hasErrors || this.busy) return Promise.resolve(false);
        this.busy = true;
        return User.current.setPasscode(this.passcodeStore.passcode)
            .then(() => {
                this.busy = false;
                systemWarnings.add({
                    content: 'warning_passcodeAdded'
                });
                window.router.push('/app');
            });
    }

    /**
     * Disable passcode.
     */
    skip() {
        window.router.push('/app');
    }

    render() {
        return (
            <div className={css('signup', 'rt-light-theme', 'show')}>
                <img alt="" className="logo" src="static/img/logo-white.png" />
                <div className="signup-form">
                    <div className="passcode">
                        <div className="signup-title">{t('title_newDevice')}</div>
                        <div className="signup-subtitle">{t('title_createPassword')}</div>
                        <p><T k="title_passwordIntro" className="signup-title">
                            {{
                                emphasis: text => <strong>{text}</strong>
                            }}
                        </T></p>
                        <Passcode store={this.passcodeStore} returnHandler={this.createPasscode} />
                    </div>

                </div>
                <FullCoverLoader show={this.busy} />

                <div className="signup-nav">
                    <Button flat label={t('button_skip')}
                        onClick={this.skip} />
                    <Button flat label={t('button_finish')}
                        onClick={this.createPasscode}
                        disabled={this.hasErrors} />
                </div>
            </div>
        );
    }
}


module.exports = NewDevice;
