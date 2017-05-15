const React = require('react');
const { Button } = require('~/react-toolbox');
const { User, errors, warnings, TinyDb } = require('~/icebear');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const css = require('classnames');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');
const T = require('~/ui/shared-components/T');
const keychain = require('~/helpers/keychain');

@observer class AutoLogin extends React.Component {
    enable() {
        keychain.savePassphrase(User.current.username, User.current.passphrase)
            .then((ret) => {
                if (!ret) {
                    console.error('Failed to set autologin (libary returned false).');
                    warnings.addSevere('title_autologinSetFail');
                }
                User.current.autologinEnabled = true;
            })
            .catch(() => {
                warnings.addSevere('title_autologinSetFail');
            });
        TinyDb.user.setValue('autologinSuggested', true);
        window.router.push('/app');
    }
    disable() {
        keychain.removePassphrase(User.current.username, User.current.passphrase)
            .then(() => {
                User.current.autologinEnabled = false;
            })
            .catch(() => {
                warnings.addSevere('title_autologinDisableFail');
            });
        TinyDb.user.setValue('autologinSuggested', true);
        window.router.push('/app');
    }
    render() {
        return (
            <div className="auto-sign-in rt-light-theme" >
                <div className="flex-align-center flex-col">
                    <img alt="peerio" className="logo" src="static/img/logo-white.png" />
                    <div className="display-2">Enable Automatic Sign-in?</div>
                    <div className="options">
                        <div className="option">
                            <Button label="enable" value="enable" className="button-gradient" onClick={this.enable} />
                            <p>
                                <em>Account Key</em> is never required to sign in. Sign out to disable.
                            </p>
                        </div>
                        <div className="option">
                            <Button label="disable" value="disable" onClick={this.disable} />
                            <p>
                                <em>Account Key</em> is always required to sign in.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = AutoLogin;
