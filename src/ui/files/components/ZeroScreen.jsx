const React = require('react');
const { Button } = require('~/react-toolbox');

function ZeroScreen(props) {
    return (
        <div className="files">
            <div className="flex-row zero-file">
                <div className="flex-col flex-grow-1" />
                <div className="flex-col flex-grow-0 flex-shrink-0">
                    <div className="flex-row" style={{ marginTop: '64px' }}>
                        <div className="display-3">Secure your files.</div>
                    </div>
                    <div className="flex-row flex-align-start" style={{ width: '100%' }}>
                        <div className="flex-col flex-align-start">
                            <p className="heading"
                                   style={{
                                       marginBottom: '48px',
                                       lineHeight: '1.4'
                                   }}>
                                    Drag and drop, upload,
                                <br />
                                    share, and manage
                                <br />
                                    your files.
                            </p>
                            <Button onClick={props.onUpload} primary label="upload" />
                        </div>
                        <img src="static/img/file-upload.png"
                                 style={{ maxWidth: '280px', minWidth: '40%' }} role="presentation" />
                    </div>
                    <p className="upgrade">Upgrade your account?</p>
                </div>
                <div className="flex-col flex-grow-1" />
            </div>
        </div>);
}

module.exports = ZeroScreen;
