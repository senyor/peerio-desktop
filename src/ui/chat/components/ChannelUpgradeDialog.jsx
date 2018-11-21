import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog } from 'peer-ui';
import { User, t } from 'peerio-icebear';
import config from '~/config';

const urls = config.translator.urlMap;

@observer
class ChannelUpgradeDialog extends React.Component {
    @observable showDialog = false;

    show = () => {
        this.showDialog = true;
    };

    hide = () => {
        this.showDialog = false;
    };

    toUpgrade = () => {
        window.open(urls.upgrade);
        this.hide();
    };

    render() {
        if (config.disablePayments) return null;
        const dialogActions = [
            { label: t('button_cancel'), onClick: this.hide },
            { label: t('button_upgrade'), onClick: this.toUpgrade }
        ];
        const limit = User.current ? User.current.channelLimit : 0;

        return (
            <Dialog
                active={this.showDialog}
                actions={dialogActions}
                onCancel={this.hide}
                title={t('title_limitDialog')}
                theme="warning"
            >
                <p>{t('title_limitDialogText1', { limit })}</p>
                <br />
                <p>{t('title_limitDialogText2')}</p>
            </Dialog>
        );
    }
}

export default ChannelUpgradeDialog;
