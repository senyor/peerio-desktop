const React = require('react');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');

class ZeroMail extends React.Component {

    render() {
        return (
            <div className="mail flex-align-center flex-justify-center">
                <div className="flex-row">
                    <div className="flex-col flex-grow-1" />
                    <div className="flex-col flex-grow-0 flex-shrink-0">
                        <div className="flex-row" style={{ marginTop: '64px' }}>
            <div className="display-3">{t('title_mailNull1')}</div>
                        </div>
                        <div className="flex-row flex-align-start" style={{ width: '100%' }}>
                            <div className="flex-col flex-align-start">
                                <p className="heading"
                                       style={{
                                           marginBottom: '48px',
                                           lineHeight: '1.4'
                                       }}>
                                           <T k="title_mailNull2">
                                       {{
                                           emphasis: text => <strong>{text}</strong>
                                       }}
                                   </T>
                                </p>
                            </div>
                            <img src="static/img/ghost.png"
                                     style={{ maxWidth: '280px', minWidth: '40%' }} alt="" />
                        </div>
                    </div>
                    <div className="flex-col flex-grow-1" />
                </div>
            </div>
        );
    }
}

module.exports = ZeroMail;
