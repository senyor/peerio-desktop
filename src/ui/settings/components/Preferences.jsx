const React = require('react');
const { observer } = require('mobx-react');
const { Switch } = require('~/react-toolbox');
const { t } = require('peerio-translator');

@observer
class Preferences extends React.Component {

    render() {
        return (
            <div>
                <section className="section-divider">
                    <div className="title">{t('title_notifications')}</div>
                    <p>
                        {t('title_notificationsDetail')}
                        {/* Email you when... */}
                    </p>
                    <Switch checked="true" label={t('title_never')} />
                    <Switch checked="false" label={t('title_notificationsMessage')} />
                    <Switch checked="false" label={t('title_notificationsFile')} />
                    <Switch checked="false" label={t('title_notificationsContact')} />
                </section>

                <section>
                    <div className="title">{t('title_privacy')}</div>
                    <p>
                        {t('title_privacyDetail')}
                        {/* Other users can find you... */}
                    </p>
                    <Switch checked="true" label={t('title_never')} />
                    <Switch checked="false" label={t('title_yourName')} />
                    <Switch checked="false" label={t('title_yourUsername')} />
                    <Switch checked="false" label={t('title_yourEmail')} />
                </section>
            </div>
        );
    }
  }

module.exports = Preferences;
