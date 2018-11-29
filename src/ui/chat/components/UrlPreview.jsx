import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Button } from 'peer-ui';
import T from '~/ui/shared-components/T';
import { fileStore, t } from 'peerio-icebear';

const forceShowCache = observable.map();

@observer
class UrlPreview extends React.Component {
    forceDownload = () => {
        forceShowCache.set(this.props.urlData.url, true);
    };

    render() {
        const { url, isOversizeCutoff, isOverInlineSizeLimit, isInsecure } = this.props.urlData;
        const tooBig = !isOversizeCutoff && isOverInlineSizeLimit;
        const showImage = forceShowCache.get(url) || (!tooBig && !isOversizeCutoff);
        return (
            <div className="urlpreview">
                <div>
                    <div className="url-content">
                        <div className="url-image">
                            {!showImage && tooBig && (
                                <div className="image-over-limit-warning">
                                    <T k="title_imageSizeWarning">
                                        {{
                                            size: fileStore.inlineImageSizeLimitFormatted
                                        }}
                                    </T>
                                    <Button
                                        className="display-this-image display-over-limit-image"
                                        onClick={this.forceDownload}
                                    >
                                        {t('button_displayThisImageAfterWarning')}
                                    </Button>
                                </div>
                            )}
                            {isOversizeCutoff && (
                                <div className="image-over-limit-warning">
                                    <T k="title_imageTooBigCutoff">
                                        {{
                                            size: fileStore.inlineImageSizeLimitCutoffFormatted
                                        }}
                                    </T>
                                </div>
                            )}
                            {showImage &&
                                (isInsecure ? (
                                    <div className="image-insecure">
                                        <div className="image-insecure-text">
                                            <T k="title_insecureImagePreviewWarning" />
                                        </div>
                                    </div>
                                ) : (
                                    <img src={url} onLoad={this.props.onImageLoaded} />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UrlPreview;
