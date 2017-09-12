const React = require('react');
const { t } = require('peerio-translator');
const { Button } = require('~/react-toolbox');

function ZeroScreen(props) {
    return (
        <div className="files">
            <div className="flex-row zero-file">
                <div className="flex-col flex-grow-1" />
                <div className="flex-col flex-grow-0 flex-shrink-0">
                    <div className="flex-row" style={{ marginTop: '64px' }}>
                        <div className="display-3">{t('title_filesNull1')}</div>
                    </div>
                    <div className="flex-row flex-align-start" style={{ width: '100%' }}>
                        <div className="flex-col flex-align-start">
                            <p style={{
                                marginBottom: '48px',
                                lineHeight: '1.4',
                                width: '200px'
                            }}>
                                {t('title_filesNull2')}
                            </p>
                            <Button onClick={props.onUpload} primary label={t('button_upload')} />
                        </div>
                        <img src="static/img/file-upload.png"
                            style={{ maxWidth: '280px', minWidth: '40%' }} alt="" />
                    </div>
                </div>
                <div className="flex-col flex-grow-1" />
            </div>
        </div>);
}

module.exports = ZeroScreen;
