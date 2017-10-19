const React = require('react');
const { fileStore } = require('~/icebear');
const { Button, FontIcon, ProgressBar, Dialog, RadioGroup, RadioButton } = require('~/react-toolbox');
const { downloadFile } = require('~/helpers/file');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const uiStore = require('~/stores/ui-store');
const routerStore = require('~/stores/router-store');
const css = require('classnames');
const FileActions = require('~/ui/files/components/FileActions');

const ALL_IMAGES = 'all_images';
const UNDER_LIMIT_ONLY = 'under_limit_only';
const DISABLED = 'disabled';

// this is temporary, until we rework files
const gaveUpMap = {};

@observer
class InlineFile extends React.Component {
    @observable isExpanded;
    @observable currentImageSrc;
    @observable imagePopupVisible = false;

    @observable selectedMode = ALL_IMAGES;
    @observable firstSave = false;

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

    toggleExpand = () => {
        this.isExpanded = !this.isExpanded;
    }

    forceDownload = () => {
        const file = fileStore.getById(this.props.id);
        if (!file) return; // should not really happen
        file.downloadToTmpCache();
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
                <div className="info-bar">
                    <div className="left">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">{file.sizeFormatted}</div>
                    </div>
                    <div className="right">
                        <Button caption={t('title_download')}
                            icon="file_download"
                            onClick={file.download}
                            className={css('button-small', { disabled: this.props.downloadDisabled })} />

                        <Button caption={t('button_share')}
                            icon="reply"
                            onClick={file.share}
                            className={css('reverse-icon', 'button-small', { disabled: this.props.shareDisabled })} />
                        <Button caption={t('button_delete')}
                            icon="delete"
                            onClick={file.deleteFile}
                            className={css('button-small', { disabled: this.props.deleteDisabled })} />
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
        if (!gaveUpMap[id]) this.props.startTimer();
        return (<div className="unknown-file" key={id}>
            {t((this.giveUp || gaveUpMap[id]) ? 'error_fileRemoved' : 'title_processing')}
            {this.giveUp || gaveUpMap[id]
                ? null
                : <ProgressBar type="linear" mode="indeterminate" />
            }
        </div>);
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
                <T k="title_imageSizeWarning" className="text" />&nbsp;
                <Button className="display-this-image display-overlimit-image"
                    onClick={this.forceDownload}>
                    {t('button_displayThisImageAfterWarning')}
                </Button>
            </div>
        );
    }

    render() {
        const file = fileStore.getById(this.props.id);
        if (!file) return this.renderNoFile(this.props.id);
        if (file.signatureError) return this.renderNoSignature(this.props.id);
        if (file.isImage && !file.tmpCached) {
            setTimeout(() => {
                // this.isExpanded = uiStore.prefs.peerioContentEnabled;
                file.tryToCacheTemporarily();
            });
        }

        const textParser = {
            toSettings: text => <a className="clickable" onClick={this.goToSettings}>{text}</a>
        };

        return (
            <div className="inline-files-container">
                <div className="inline-files">
                    <div className="inline-files-topbar">
                        <div className="shared-file" data-id={this.props.id}>
                            <div className="container">
                                <div className="file-icon">
                                    {file.isImage &&
                                        <FontIcon value="image" />
                                    }
                                </div>
                                <div className="file-name">
                                    {file.name}
                                </div>
                                {(file.isImage && uiStore.prefs.peerioContentConsented) &&
                                    <Button icon={this.isExpanded
                                        ? 'arrow_drop_down'
                                        : 'arrow_drop_up'
                                    } onClick={this.toggleExpand} />
                                }
                                <FileActions downloadDisabled={!file.readyForDownload || file.downloading}
                                    shareDisabled={!file.readyForDownload || !file.canShare} newFolderDisabled
                                    deleteDisabled={false}
                                    {...this.props} />
                            </div>
                            {file.downloading
                                ? <ProgressBar type="linear" mode="determinate" value={file.progress}
                                    max={file.progressMax} />
                                : null
                            }
                        </div>
                    </div>
                    {this.isExpanded && uiStore.prefs.peerioContentConsented &&
                        <div className={css('inline-files-expanded',
                            { 'display-image': uiStore.prefs.peerioContentEnabled && !file.isOverInlineSizeLimit })}>
                            {file.tmpCached || this.inlineImagesEnabled
                                ? <div className="inline-files-dropdown">
                                    {file.tmpCached
                                        ? <img src={file.tmpCachePath} alt="" onLoad={this.props.onImageLoaded}
                                            onClick={this.imageClick} />
                                        : (file.isOverInlineSizeLimit
                                            ? this.renderOversizeWarning()
                                            : <img src="./static/img/bg-pattern.png" alt="" />)
                                    }
                                </div>
                                : <Button className="display-this-image" onClick={this.forceDownload}>
                                    {t('button_displayThisImage')}
                                </Button>

                            }
                        </div>
                    }
                    {this.currentImageSrc && this.imagePopup}
                </div>
                <div>{!uiStore.prefs.peerioContentConsented &&
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
    // give up waiting for file object to appear in store
    @observable giveUp = false;

    startTimer = () => {
        if (this.timer) return;
        this.timer = setTimeout(() => {
            this.giveUp = true;
            this.props.files.forEach(f => {
                if (gaveUpMap[f]) return;
                if (!fileStore.getById(f)) gaveUpMap[f] = true;
            });
        }, 60000);
    };

    componentWillUnmount() {
        if (this.timer) clearTimeout(this.timer);
    }

    download(id) {
        const file = fileStore.getById(id);
        if (!file || file.downloading) return;
        downloadFile(file);
    }

    share(id) {
        const file = fileStore.getById(id);
        if (!file || file.downloading) return;
        fileStore.clearSelection();
        file.selected = true;
        window.router.push('/app/sharefiles');
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
                            onShare={() => this.share(f)}
                            onDownload={() => this.download(f)}
                            startTimer={this.startTimer}
                            onImageLoaded={this.props.onImageLoaded} {...this.props} />)
                    )
                }
            </div>
        );
    }
}

module.exports = InlineFiles;
