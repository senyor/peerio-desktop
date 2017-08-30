const React = require('react');
const { observer } = require('mobx-react');
const { Button } = require('~/react-toolbox');
const { t } = require('peerio-translator');

@observer
class ChannelCreateOffer extends React.Component {
    render() {
        return (
            <div className="upgrade-rooms">
                <div>
                    <span role="img" aria-label="waving hand">👋 </span>
                    {t('title_channelCreateOffer')}
                </div>
                <Button flat primary label={t('button_createChannel')} onClick={() => window.router.push('/app/new-channel')} />
            </div>
        );
    }
}

module.exports = ChannelCreateOffer;
