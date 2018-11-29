import React from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { fileStore, t } from 'peerio-icebear';
import { Button, MaterialIcon } from 'peer-ui';
import T from '~/ui/shared-components/T';
import FileSpriteIcon from '~/ui/shared-components/FileSpriteIcon';
import { ExternalWebsite, ExternalImage } from 'peerio-icebear/dist/helpers/unfurl/types';
import css from 'classnames';

const forceShowCache = observable.map();

interface UrlPreviewWebsiteProps {
    type: 'html';
    urlData: ExternalWebsite;
    onImageLoaded?: () => void;
}

interface UrlPreviewImageProps {
    type: 'image';
    urlData: ExternalImage;
    onImageLoaded?: () => void;
}

@observer
export default class UrlPreview extends React.Component<
    UrlPreviewImageProps | UrlPreviewWebsiteProps
> {
    @observable expanded = true;

    @action.bound
    toggleExpand() {
        this.expanded = !this.expanded;
    }

    @computed
    get isToggleVisible() {
        return (
            this.props.type === 'image' ||
            (this.props.type === 'html' &&
                !!(this.props.urlData.title || this.props.urlData.description))
        );
    }

    @computed
    get headerText() {
        if (this.props.type === 'html') {
            return this.props.urlData.siteName || this.props.urlData.url;
        }
        if (this.props.type === 'image') {
            return this.expanded ? t('title_collapsePreview') : t('title_expandPreview');
        }
        return null;
    }

    render() {
        return (
            <div className="url-preview">
                <div className="url-info">
                    <UrlPreviewHeader
                        type={this.props.type}
                        text={this.headerText}
                        favicon={
                            this.props.type === 'html' && !!this.props.urlData.favicon
                                ? this.props.urlData.favicon.url
                                : undefined
                        }
                        isToggleVisible={this.isToggleVisible}
                        onToggleExpand={this.toggleExpand}
                        expanded={this.expanded}
                    />
                </div>

                {this.expanded ? (
                    <div className="preview-content">
                        {this.props.type === 'html' ? (
                            <UrlPreviewWebsite
                                {...this.props.urlData}
                                onImageLoaded={this.props.onImageLoaded}
                            />
                        ) : null}
                        {this.props.type === 'image' ? (
                            <UrlPreviewImage
                                {...this.props.urlData}
                                onImageLoaded={this.props.onImageLoaded}
                            />
                        ) : null}
                    </div>
                ) : null}
            </div>
        );
    }
}

@observer
class UrlPreviewHeader extends React.Component<{
    type: 'html' | 'image';
    favicon?: string;
    text: string;
    isToggleVisible: boolean;
    onToggleExpand: () => void;
    expanded: boolean;
}> {
    render() {
        return (
            <div className="url-preview-header">
                <span className="favicon">
                    {this.props.type === 'html' ? (
                        this.props.favicon ? (
                            <img src={this.props.favicon} alt="" />
                        ) : (
                            <MaterialIcon icon="language" />
                        )
                    ) : null}
                    {this.props.type === 'image' ? (
                        <FileSpriteIcon type="img" size="small" />
                    ) : null}
                </span>
                <span
                    className={css('site-name', { clickable: this.props.type === 'image' })}
                    onClick={this.props.type === 'image' ? this.props.onToggleExpand : null}
                >
                    {this.props.text}
                </span>
                <Button
                    icon={this.props.expanded ? 'arrow_drop_up' : 'arrow_drop_down'}
                    onClick={this.props.onToggleExpand}
                />
            </div>
        );
    }
}

@observer
class UrlPreviewWebsite extends React.Component<ExternalWebsite & { onImageLoaded?: () => void }> {
    render() {
        return (
            <>
                <div className="preview-text">
                    <a href={this.props.url}>{this.props.title || this.props.siteName}</a>
                    {this.props.description ? (
                        <div className="description">{this.props.description}</div>
                    ) : null}
                </div>
                {this.props.image ? (
                    <div className="url-image">
                        <img
                            src={this.props.image.url}
                            alt={this.props.imageAlt || ''}
                            onLoad={this.props.onImageLoaded}
                        />
                    </div>
                ) : null}
            </>
        );
    }
}

@observer
class UrlPreviewImage extends React.Component<ExternalImage & { onImageLoaded?: () => void }> {
    forceDownload = () => {
        forceShowCache.set(this.props.url, true);
    };

    render() {
        const { url, isOversizeCutoff, isOverInlineSizeLimit, isInsecure } = this.props;
        const tooBig = !isOversizeCutoff && isOverInlineSizeLimit;
        const showImage = forceShowCache.get(url) || (!tooBig && !isOversizeCutoff);

        return (
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
        );
    }
}
