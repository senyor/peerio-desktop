import React from 'react';
import { Button } from 'peer-ui';
import { observer } from 'mobx-react';
import autologin from '~/helpers/autologin';
import { t } from 'peerio-icebear';
import T from '~/ui/shared-components/T';

@observer
class AutoLogin extends React.Component {
    enable() {
        autologin.enable();
        autologin.dontSuggestEnablingAgain();
        window.router.push('/app/chats');
    }
    disable() {
        autologin.disable();
        autologin.dontSuggestEnablingAgain();
        window.router.push('/app/chats');
    }
    render() {
        return (
            <div className="auto-sign-in">
                <div className="content">
                    <img alt="peerio" className="logo" src="static/img/logo-white.png" />
                    <div className="display-2">{t('title_enableAutomatic')}</div>
                    <div className="options">
                        <div className="option">
                            <Button
                                label={t('button_enable')}
                                value="enable"
                                onClick={this.enable}
                            />
                            <p>
                                <T k="title_enableAutomatic1" />
                            </p>
                        </div>
                        <div className="option">
                            <Button
                                label={t('button_disable')}
                                value="disable"
                                onClick={this.disable}
                            />
                            <p>
                                <T k="title_enableAutomatic2" />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AutoLogin;
