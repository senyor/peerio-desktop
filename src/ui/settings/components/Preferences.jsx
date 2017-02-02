const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Switch } = require('~/react-toolbox');
const { t } = require('peerio-translator');

@observer class Preferences extends React.Component {

    render() {
        return (
            <div>
                <section className="section-divider">
                    <div className="title">{t('notifications')}</div>
                    <p>
                        {t('description_notification')}
                        {/* Email you when... */}
                    </p>
                    <Switch checked="true" label={t('never')} />
                    <Switch checked="false" label={t('newMessage')} />
                    <Switch checked="false" label={t('newFile')} />
                    <Switch checked="false" label={t('contactRequest')} />
                </section>

                <section>
                    <div className="title">{t('privacy')}</div>
                    <p>
                        {t('description_privacy')}
                        {/* Other users can find you... */}
                    </p>
                    <Switch checked="true" label={t('never')} />
                    <Switch checked="false" label={t('byName')} />
                    <Switch checked="false" label={t('byUsername')} />
                    <Switch checked="false" label={t('byEmail')} />
                </section>
            </div>
        );
    }
  }

module.exports = Preferences;
