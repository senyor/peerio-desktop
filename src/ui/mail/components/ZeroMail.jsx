const React = require('react');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');

class ZeroMail extends React.Component {
    render() {
        return (
            <div className="mail zero-mail">
                <div className="container">
                    <div className="spacer" />
                    <div className="content">
                        <div className="display-3">{t('title_mailNull1')}</div>
                        <div className="text">
                            <p className="heading">
                                <T k="title_mailNull2" />
                            </p>
                        </div>
                        <img src="static/img/ghost.png" alt="" />
                    </div>
                    <div className="spacer" />
                </div>
            </div>
        );
    }
}

module.exports = ZeroMail;
