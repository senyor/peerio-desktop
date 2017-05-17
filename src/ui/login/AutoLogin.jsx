const React = require('react');
const { Button } = require('~/react-toolbox');
const { TinyDb } = require('~/icebear');
const { observer } = require('mobx-react');
const autologin = require('~/helpers/autologin');
const { t } = require('peerio-translator');

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
                    <div className="display-2">{t('title_enableAutomatic')}</div>
                    <div className="options">
                        <div className="option">
                            <Button label={t('button_enable')} value="enable" className="button-gradient" onClick={this.enable} />
                            <p>
                                {t('title_enableAutomatic1')}
                            </p>
                        </div>
                        <div className="option">
                            <Button label={t('button_disable')} value="disable" onClick={this.disable} />
                            <p>
                                {t('title_enableAutomatic2')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = AutoLogin;
