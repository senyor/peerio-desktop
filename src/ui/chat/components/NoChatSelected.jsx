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
            <div className="flex-col flex-grow-0">
                <div className="flex-col flex-align-center">
                    <div className="display-3">{t('title_chatNull1')}</div>
                    <p style={{
                        marginBottom: '48px'
                    }}>
                        {t('title_chatNull2')}
                    </p>
                </div>
                <div className="flex-row flex-align-start flex-justify-center" style={{ width: '100%' }}>
                    <img src="static/img/group-chat.png" alt=""
                         style={{ maxWidth: '280px', maxHeight: '233px', minWidth: '40%' }} />
                </div>
            </div>
        </div>
    );
}

module.exports = NoChatSelected;
