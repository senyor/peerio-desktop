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
        if (config.disablePayments) return null;
        if (User.current.channelLimit === Number.MAX_SAFE_INTEGER) return null;
        return (
            <div className="upgrade-rooms">
                <div>
                    <span>👋 </span>
                    <T k="title_channelUpgradeOffer">{{ limit: User.current.channelLimit }}</T>
                </div>
                <Button flat primary label={t('button_upgrade')} />
            </div>
        );
    }
}

module.exports = ChannelUpgradeOffer;
