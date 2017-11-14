const React = require('react');
const { fileStore, User } = require('~/icebear');
const { Button, FontIcon, ProgressBar, Dialog, RadioGroup, RadioButton } = require('~/react-toolbox');
const { downloadFile } = require('~/helpers/file');
const { observable, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const uiStore = require('~/stores/ui-store');
const routerStore = require('~/stores/router-store');
const css = require('classnames');
const FileActions = require('~/ui/files/components/FileActions');
const { getAttributeInParentChain } = require('~/helpers/dom');

const ALL_IMAGES = 'all_images';
const UNDER_LIMIT_ONLY = 'under_limit_only';
const DISABLED = 'disabled';

@observer
class InlineFile extends React.Component {
    @observable isExpanded;
    @observable currentImageSrc;
    @observable imagePopupVisible = false;

    @observable selectedMode = ALL_IMAGES;
    @observable firstSave = false;

    @observable errorLoading = false;

    // give up waiting for file object to appear in store
    @observable giveUp = false;

    startTimer = () => {
        if (this.timer) return;
        this.timer = setTimeout(() => {
            if (!fileStore.getById(this.props.id)) this.giveUp = true;
        }, 30000);
    };

    componentWillMount() {
        // this code waits for file to appear in the store
        // TODO: replace it with a cassandra query
        this._fileReaction = reaction(() => fileStore.getById(this.props.id), file => {
            if (!file) {
                this.startTimer();
                return;
            }
            const { peerioContentEnabled, peerioContentConsented } = uiStore.prefs;
            if (file.isImage && peerioContentEnabled && peerioContentConsented) this.isExpanded = true;
            if (file.isImage && peerioContentEnabled && peerioContentConsented &&
                !file.isOverInlineSizeLimit && !file.isOversizeCutoff) {
                if (!file.tmpCached) file.tryToCacheTemporarily();
            }
        }, true);
    }

    componentWillUnmount() {
        if (this.timer) clearTimeout(this.timer);
        this._fileReaction();
    }

    onSelectedModeChange = (value) => {
        this.selectedMode = value;
    }

    onDismiss = () => {
        this.firstSave = true;
        this.selectedMode = DISABLED;
        this.onSubmitConsent();
    }

    onSubmitConsent = () => {
        this.firstSave = true;
        uiStore.prefs.peerioContentConsented = true;

        switch (this.selectedMode) {
            case ALL_IMAGES:
                uiStore.prefs.peerioContentEnabled = true;
                uiStore.prefs.limitInlineImageSize = false;
                break;
            case UNDER_LIMIT_ONLY:
                uiStore.prefs.peerioContentEnabled = true;
                uiStore.prefs.limitInlineImageSize = true;
                break;
            default:
                uiStore.prefs.peerioContentEnabled = false;
                break;
        }
    }

    onErrorLoadingImage = () => {
        this.errorLoading = true;
    }

    toggleExpand = () => {
        this.isExpanded = !this.isExpanded;
    }

    forceDownload = () => {
        const file = fileStore.getById(this.props.id);
        if (!file) return; // should not really happen
        file.tryToCacheTemporarily(true);
    }

    hideImagePopup = () => {
        this.imagePopupVisible = false;
        this.currentImageSrc = '';
    }

    imageClick = (ev) => {
        this.currentImageSrc = ev.target.src;
    }

    onPopupRef = (ref) => {
        if (ref) this.imagePopupVisible = true;
    };

    goToSettings = () => {
        routerStore.navigateTo(routerStore.ROUTES.prefs);
    }

    get imagePopup() {
        const file = fileStore.getById(this.props.id);
        if (!file) return null; // just in case
        return (
            <Dialog active={this.imagePopupVisible} type="large" ref={this.onPopupRef}
                onOverlayClick={this.hideImagePopup} onEscKeyDown={this.hideImagePopup}
                className="image-popup">
                <img src={this.currentImageSrc} alt="" />
                <Button onClick={this.hideImagePopup} icon="close" className="button-close button-small" />
                <div className="info-bar" data-fileid={this.props.id}>
                    <div className="left">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">{file.sizeFormatted}</div>
                    </div>
                    <div className="right">
                        <Button caption={t('title_download')}
                            icon="file_download"
                            onClick={this.props.onDownload}
                            className={css('button-small', { disabled: this.props.downloadDisabled })} />
                        <Button caption={t('button_share')}
                            icon="reply"
                            onClick={this.props.onShare}
                            className={css('reverse-icon', 'button-small', { disabled: this.props.shareDisabled })} />
                        {(file.fileOwner === User.current.username) && <Button caption={t('button_delete')}
                            icon="delete"
                            onClick={this.props.onDelete}
                            className={css('button-small', { disabled: !this.props.deleteable })} />}
                    </div>
                </div>
            </Dialog>);
    }

    renderConsent() {
        return (
            <div className="first-time">
                <div className="warning-header">
                    <FontIcon value="security" />
                    <T k="title_enableImagePreviews" className="text" />
                </div>
                <div className="warning-body">
                    <p className="text"><T k="title_imagePreviewWarning" /></p>
                    <RadioGroup
                        className="options"
                        name="option"
                        value={this.selectedMode}
                        onChange={this.onSelectedModeChange}>
                        <RadioButton label={t('title_forAllImages')} value={ALL_IMAGES} />
                        <RadioButton label={t('title_forImagesUnder10')} value={UNDER_LIMIT_ONLY} />
                        <RadioButton label={t('title_disable')} value={DISABLED} />
                    </RadioGroup>

                    <div className="buttons-container">
                        <Button className="notnow" onClick={this.onDismiss}>{t('button_notNow')}</Button>
                        <Button className="save" onClick={this.onSubmitConsent}>{t('button_save')}</Button>
                    </div>
                </div>
            </div>
        );
    }

    renderNoFile(id) {
        if (this.giveUp) {
            return (
                <div className="inline-files-container">
                    <div className="unknown-file" key={id}>
                        {t('error_fileRemoved')}
                    </div>
                </div>
            );
        }
        return (
            <div className="inline-files-container">
                <ProgressBar type="linear" mode="indeterminate" className="unknown-file-progress-bar" />
            </div>
        );
    }

    renderNoSignature(id) {
        return (
            <div className="invalid-file" key={id} data-id={id}
                onClick={uiStore.showFileSignatureErrorDialog}>
                <div className="container">
                    <FontIcon value="info_outline" />
                    <div className="file-name">{t('error_invalidFileSignature')}</div>
                </div>
            </div>
        );
    }

    renderOversizeWarning() {
        return (
            <div className="image-over-limit-warning">
                <T k="title_imageSizeWarning" className="text">
                    {{ size: fileStore.inlineImageSizeLimitFormatted }}
                </T>&nbsp;
                <Button className="display-this-image display-over-limit-image"
                    onClick={this.forceDownload}>
                    {t('button_displayThisImageAfterWarning')}
                </Button>
            </div>
        );
    }

    renderOversizeCutoffWarning() {
        return (
            <div className="image-over-limit-warning">
                <T k="title_imageTooBigCutoff" className="text" >
                    {{ size: fileStore.inlineImageSizeLimitCutoffFormatted }}
                </T>
            </div>
        );
    }

    render() {
        const file = fileStore.getById(this.props.id);
        if (!file) return this.renderNoFile(this.props.id);
        if (file.signatureError) return this.renderNoSignature(this.props.id);

        const textParser = {
            toSettings: text => <a className="clickable" onClick={this.goToSettings}>{text}</a>
        };
        return (
            <div className="inline-files-container" data-fileid={this.props.id}>
                <div className="inline-files">
                    <div className="inline-files-topbar">
                        <div className="shared-file" data-id={this.props.id}>
                            <div className="container">
                                <div className="clickable file-name-container" onClick={this.props.onDownload}>
                                    <div className="file-icon">
                                        {file.isImage &&
                                            <FontIcon value="image" />
                                        }
                                    </div>
                                    <div className="file-name">
                                        {file.nameWithoutExtension}
                                    </div>
                                    <div className="file-ext">
                                        .{file.ext}
                                    </div>
                                </div>
                                {(file.isImage && uiStore.prefs.peerioContentConsented) &&
                                    <Button icon={this.isExpanded
                                        ? 'arrow_drop_up'
                                        : 'arrow_drop_down'
                                    } onClick={this.toggleExpand} />
                                }
                                <FileActions downloadDisabled={!file.readyForDownload || file.downloading}
                                    shareable shareDisabled={!file.readyForDownload || !file.canShare}
                                    newFolderDisabled
                                    deleteable={file.fileOwner === User.current.username}
                                    {...this.props} />
                            </div>
                            {file.deleted ? <span>File deleted</span> : null}
                            {!file.deleted && !file.cachingFailed && file.downloading
                                ? <ProgressBar type="linear" mode="determinate" value={file.progress}
                                    max={file.progressMax} />
                                : null
                            }
                        </div>
                    </div>
                    {this.isExpanded && uiStore.prefs.peerioContentConsented &&
                        <div className={css('inline-files-expanded',
                            { 'display-image': uiStore.prefs.peerioContentEnabled &&
                                (file.tmpCached || !file.isOverInlineSizeLimit) })}>
                            {file.tmpCached || uiStore.prefs.peerioContentEnabled
                                ? <div className="inline-files-dropdown">
                                    {file.tmpCached &&
                                        (this.errorLoading
                                            ? <span>{t('error_loadingImage')}</span>
                                            : <img src={file.tmpCachePath} alt=""
                                                onLoad={this.props.onImageLoaded}
                                                onError={this.onErrorLoadingImage}
                                                onClick={this.imageClick} />)}
                                    {!file.tmpCached && !file.downloading && file.isOverInlineSizeLimit
                                        && !file.isOversizeCutoff
                                            && this.renderOversizeWarning()}
                                    {file.isOversizeCutoff
                                            && this.renderOversizeCutoffWarning()}
                                    {file.downloading && !file.tmpCached &&
                                        <img src="./static/img/bg-pattern.png" alt="" />}
                                    {file.cachingFailed ? <span>{t('error_downloadFailed')}</span> : null}
                                </div>
                                : <Button className="display-this-image" onClick={this.forceDownload}>
                                    {t('button_displayThisImage')}
                                </Button>
                            }
                        </div>
                    }
                    {this.currentImageSrc && this.imagePopup}
                </div>
                <div>{!uiStore.prefs.peerioContentConsented && file.isImage &&
                    this.renderConsent()
                }</div>
                <div>
                    {this.firstSave &&
                        <div className="update-settings">
                            <FontIcon value="check_circle" />
                            <T k="title_updateSettingsAnyTime" className="text">{textParser}</T>
                        </div>
                    }
                </div>
            </div>
        );
    }
}


@observer
class InlineFiles extends React.Component {
    download(ev) {
        const file = fileStore.getById(getAttributeInParentChain(ev.target, 'data-fileid'));
        if (!file || file.downloading) return;
        downloadFile(file);
    }

    share(ev) {
        const file = fileStore.getById(getAttributeInParentChain(ev.target, 'data-fileid'));
        if (!file || file.downloading) return;
        fileStore.clearSelection();
        file.selected = true;
        window.router.push('/app/sharefiles');
    }


    deleteFile(ev) {
        const file = fileStore.getById(getAttributeInParentChain(ev.target, 'data-fileid'));
        let msg = t('title_confirmRemoveFilename', { name: file.name });
        if (file.shared) {
            msg += `\n\n${t('title_confirmRemoveSharedFiles')}`;
        }
        if (confirm(msg)) {
            file.remove();
        }
    }

    render() {
        if (!this.props.files.map) return null;
        return (
            <div>
                {
                    this.props.files.map(f =>
                        (<InlineFile
                            key={f}
                            id={f}
                            onShare={this.share}
                            onDownload={this.download}
                            onDelete={this.deleteFile}
                            startTimer={this.startTimer}
                            onImageLoaded={this.props.onImageLoaded} {...this.props} />)
                    )
                }
            </div>
        );
    }
}

module.exports = InlineFiles;
