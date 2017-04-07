const React = require('react');
const { t } = require('peerio-translator');

function NoChatSelected() {
    return (
        <div className="zero-message" style={{ postion: 'relative' }}>
            <img src="static/img/message-arrow-up.png"
                 style={{
                     maxWidth: '200px',
                     position: 'absolute',
                     left: '24px',
                     top: '80px'
                 }} alt="" />
            <div className="flex-col flex-grow-0 flex-shrink-0">
                <div className="flex-row flex-justify-center">
                    <div className="display-3">{t('title_chatNull1')}</div>
                </div>
                <div className="flex-row flex-align-start flex-justify-center" style={{ width: '100%' }}>
                    <p className="heading"
                       style={{
                           marginBottom: '48px',
                           marginRight: '24px',
                           lineHeight: '1.4'
                       }}>
                        {t('title_chatNull2')}
                        <br />
                        {t('title_chatNull3')}
                        <br />
                        {t('title_chatNull4')}
                    </p>
                    <img src="static/img/group-chat.png" alt=""
                         style={{ maxWidth: '280px', maxHeight: '233px', minWidth: '40%' }} />
                </div>
            </div>
        </div>
    );
}

module.exports = NoChatSelected;
