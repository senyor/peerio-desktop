const React = require('react');
const { observer } = require('mobx-react');
const { Button } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const config = require('../../../config');

@observer
class ChannelUpgradeOffer extends React.Component {
    render() {
        return (
            <div className="upgrade-channels">
                <div>
                    <span role="img" aria-label="waving hand">👋 </span>
                    <span>{t('title_channelUpgradeOffer', { limit: config.maxFreeChannels })}</span>
                </div>
                <Button flat primary label={t('button_upgrade')} />
            </div>
        );
    }
}

module.exports = ChannelUpgradeOffer;
