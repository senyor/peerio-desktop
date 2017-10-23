const React = require('react');
const { observer } = require('mobx-react');
const config = require('~/config');
const { util } = require('~/icebear');

@observer
class UrlPreview extends React.Component {
    render() {
        const urlData = this.props.urlData;

        return (
            <div className="urlpreview">
                <div>
                    <div className="url-content">
                        {/* <div className="url-title">
                                <a href="#">Website banner title</a>
                            </div>
                            <div className="url-info">
                                <span className="url-condensed">address.com</span>
                            </div>
                            */}
                        <div className="url-image">
                            {
                                urlData.oversized && !urlData.forceShow
                                    ? <div>
                                            This image exceeds {util.formatBytes(config.chat.inlineImageSizeLimit)},
                                        <a>expand it anyway</a>
                                    </div>
                                    : <img src={urlData.url} onLoad={this.props.onImageLoaded} alt="" />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = UrlPreview;
