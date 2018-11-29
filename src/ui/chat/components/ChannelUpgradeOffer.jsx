import React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'peer-ui';
import { User, t } from 'peerio-icebear';
import config from '~/config';
import T from '~/ui/shared-components/T';

const urls = config.translator.urlMap;

@observer
class ChannelUpgradeOffer extends React.Component {
    toUpgrade() {
        return window.open(urls.upgrade);
    }

    render() {
        if (config.disablePayments) return null;
        if (User.current.channelsLeft > 0) return null;
        return (
            <div className="upgrade-rooms">
                <div>
                    <span>👋 </span>
                    <T k="title_channelUpgradeOffer">{{ limit: User.current.channelLimit }}</T>
                </div>
                <Button onClick={this.toUpgrade} label={t('button_upgrade')} />
            </div>
        );
    }
}

export default ChannelUpgradeOffer;
