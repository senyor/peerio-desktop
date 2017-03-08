const React = require('react');
const { t } = require('peerio-translator');

function NoChatSelected() {
    return (
        <div className="flex-row zero-message">
            <div className="flex-col flex-grow-0" style={{ margin: '16px 24px' }}>
                <img src="static/img/message-arrow-up.png" style={{ maxWidth: '200px' }} alt="" />
            </div>
            <div className="flex-col flex-grow-0 flex-shrink-0">
                <div className="flex-row flex-justify-center">
		<div className="display-3">{t('title_chatNull1')}</div>
                </div>
                <div className="flex-row flex-align-center flex-justify-center" style={{ width: '100%' }}>
                    <img src="static/img/group-chat.png" alt=""
                         style={{ maxWidth: '280px', minWidth: '40%' }} />
                    <ul>
                        <li>{t('title_chatNull2')}</li>
                        <li>{t('title_chatNull3')}</li>
                        {/* <li>Channels</li>*/}
                        <li>{t('title_chatNull4')}</li>
                    </ul>
                </div>
            </div>
            <div className="flex-col flex-grow-1" />
        </div>
    );
}

module.exports = NoChatSelected;
