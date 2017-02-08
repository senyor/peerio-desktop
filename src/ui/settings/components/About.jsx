const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const version = require('electron').remote.app.getVersion();

@observer
class About extends React.Component {

    render() {
        return (
            <div>
                <section className="section-divider">
                    <img role="presentation" className="logo" src="static/img/logo-blue.png" />
                    <p>
                        {t('currentVersion')} : <strong>{version}</strong>
                    </p>

                </section>

                <section>
                    <div className="title">{t('support')}</div>
                    <p>
                        {t('description_support')}
                        {/* Other users can find you... */}
                    </p>
                    <div className="flex-row">
                        <Button label={t('button_faq')} flat primary />
                        <Button label={t('button_support')} flat primary />
                    </div>
                </section>
                <section>
                    &copy; 2017 Peerio Technologies , Inc. All rights reserved.
                    <br /><br />
                    Peerio <a href="www.google.com">Terms of Service</a>
                </section>
            </div>
        );
    }
  }

module.exports = About;
