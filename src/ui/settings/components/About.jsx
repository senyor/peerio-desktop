import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { remote as electron } from 'electron';

import { socket, t } from 'peerio-icebear';
import { Button } from 'peer-ui';

import Copyright from '~/whitelabel/components/Copyright';
import PoweredBySettings from '~/whitelabel/components/PoweredBySettings';
import LegalDialog from '~/ui/shared-components/LegalDialog';

const version = electron.app.getVersion();

@observer
export default class About extends React.Component {
    @observable termsDialogOpen = false;
    @observable legalDialogRef = React.createRef();

    showTermsDialog = () => {
        this.legalDialogRef.current.showDialog();
    };

    render() {
        return (
            <div>
                <section className="section-divider">
                    <img className="logo" src="static/img/logo-withtext.svg" />
                    <PoweredBySettings />
                    <p>
                        {t('title_version')} <strong>{version}</strong>
                    </p>
                    <p>
                        {t('title_networkLatency')} <strong>{socket.latency}ms</strong>
                    </p>
                </section>
                <section>
                    <Copyright />
                    <div className="settings-terms">
                        {t('title_appName')}
                        <Button
                            onClick={this.showTermsDialog}
                            label={t('button_terms')}
                            theme="link"
                        />
                    </div>
                </section>
                <section className="attributions">
                    Emoji support by <span className="emojione emojione-32-nature _1f984" />{' '}
                    <a href="https://emojione.com">EmojiOne</a>.
                </section>

                <LegalDialog content="terms" ref={this.legalDialogRef} />
            </div>
        );
    }
}
