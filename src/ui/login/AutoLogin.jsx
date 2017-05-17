const React = require('react');
const { Button } = require('~/react-toolbox');
const { TinyDb } = require('~/icebear');
const { observer } = require('mobx-react');
const autologin = require('~/helpers/autologin');

@observer class AutoLogin extends React.Component {
    enable() {
        autologin.enable();
        autologin.dontSuggestEnablingAgain();
        window.router.push('/app');
    }
    disable() {
        autologin.disable();
        autologin.dontSuggestEnablingAgain();
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
