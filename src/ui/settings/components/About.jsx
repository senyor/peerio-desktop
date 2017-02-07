const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Switch } = require('~/react-toolbox');
const { t } = require('peerio-translator');

@observer
class About extends React.Component {

    render() {
        return (
            <div>
                <section className="section-divider">
                    <img role="presentation" className="logo" src="static/img/logo-blue.png" />
                    <p>
                        {t('description_notification')}
                        {/* Email you when... */}
                    </p>

                </section>

                <section>
                    <div className="title">{t('support')}</div>
                    <p>
                        {t('description_support')}
                        {/* Other users can find you... */}
                    </p>
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
