const React = require('react');
const { observer } = require('mobx-react');
const { Button } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const { User } = require('~/icebear');
const config = require('../../../config');
const T = require('~/ui/shared-components/T');

@observer
class ChannelUpgradeOffer extends React.Component {
    render() {
        const limit = User.current ? User.current.channelLimit : config.maxFreeChannels;
        return (
            <div className="upgrade-channels">
                <div>
                    <span role="img" aria-label="waving hand">👋 </span>
                    <T k="title_channelUpgradeOffer">{{ limit }}</T>
                </div>
                <Button flat primary label={t('button_upgrade')} />
            </div>
        );
    }
}

module.exports = ChannelUpgradeOffer;
