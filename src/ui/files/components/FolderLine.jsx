// @ts-check
const React = require('react');
const { observable, action } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const FolderActions = require('./FolderActions');
const FileFolderDetailsRow = require('./FileFolderDetailsRow');
const {
    Button,
    Checkbox,
    CustomIcon,
    MaterialIcon,
    ProgressBar
} = require('peer-ui');
const ContactProfile = require('~/ui/contact/components/ContactProfile');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { User, contactStore, fileStore } = require('peerio-icebear');
const { setCurrentFolder } = require('../helpers/sharedFileAndFolderActions');

/**
 * HACK: defs are MIRRORED in DroppableFolderLine.jsx (since that extends these props to pass them through).
 * we can't import/export interfaces in @ts-check mode since it's a total hack :(
 *
 * this will resolve itself if we ever switch to typescript -- in the meantime, if you change them here,
 * change them in there as well!
 * @typedef {{
        folder: any,
        checkbox: boolean,
        disabledCheckbox?: boolean
        className?: string,
        folderDetails?: true,
        folderDetailsMini?: boolean,
        folderActions?: true,
        isDragging?: boolean,
        isBeingDraggedOver?: boolean,
        canBeDroppedInto?: boolean,
        showNavigation?: boolean
    }} FolderLineProps
 */

/**
 * @augments {React.Component<FolderLineProps, {}>}
 */
@observer
class FolderLine extends React.Component {
    @observable hovered;
    @action.bound
    onMenuClick() {
        this.hovered = true;
    }
    @action.bound
    onMenuHide() {
        this.hovered = false;
    }

    setContactProfileRef = ref => {
        if (ref) this.contactProfileRef = ref;
    };

    onClickFolder = () => {
        setCurrentFolder(this.props.folder);
    };

    @action.bound
    toggleSelected() {
        this.props.folder.selected = !this.props.folder.selected;
    }

    onActionInProgress = () => {
        fileStore.clearSelection();
        this.toggleSelected();
    };

    @observable clickedContact;
    @action.bound
    openContact() {
        this.clickedContact = contactStore.getContact(this.props.folder.owner);
        this.contactProfileRef.openDialog();
    }

    render() {
        const {
            folder,
            isDragging,
            isBeingDraggedOver,
            canBeDroppedInto,
            showNavigation
        } = this.props;

        const selectDisabled = this.props.disabledCheckbox;
        const { progress, progressMax, progressPercentage } = folder;
        const shareInProgress =
            folder.convertingToVolume || folder.convertingFromFolder;

        return (
            <div
                data-folderid={folder.id}
                data-storeid={folder.store.id}
                className={css(
                    'row-container',
                    'folder-row-container',
                    'custom-icon-hover-container',
                    this.props.className,
                    {
                        hover: this.hovered,
                        'selected-row': folder.selected,
                        'share-in-progress': shareInProgress,
                        'dragged-row': isDragging,
                        'folder-row-droppable-hovered':
                            isBeingDraggedOver && canBeDroppedInto
                    }
                )}
            >
                <div className="row">
                    {shareInProgress ? (
                        <div className="file-checkbox percent-progress">
                            {`${progressPercentage}%`}
                        </div>
                    ) : this.props.checkbox ? (
                        <Checkbox
                            className={css('file-checkbox', {
                                disabled: selectDisabled
                            })}
                            checked={folder.selected}
                            onChange={
                                selectDisabled ? null : this.toggleSelected
                            }
                        />
                    ) : (
                        <div className="file-checkbox" />
                    )}

                    <div className="file-icon" onClick={this.onClickFolder}>
                        {folder.canShare ? (
                            <MaterialIcon icon="folder" />
                        ) : (
                            <CustomIcon
                                icon="folder-shared"
                                hover
                                selected={folder.selected}
                            />
                        )}
                    </div>

                    <div
                        className="file-name clickable selectable"
                        onClick={this.onClickFolder}
                    >
                        {folder.name}

                        {this.props.folderDetailsMini && (
                            <FileFolderDetailsRow folder={folder} />
                        )}
                    </div>

                    {this.props.folderDetails && (
                        <div
                            className="file-owner clickable"
                            onClick={this.openContact}
                        >
                            {shareInProgress ? (
                                <T k="title_convertingToShared" />
                            ) : folder.owner === User.current.username ? (
                                t('title_you')
                            ) : (
                                folder.owner
                            )}
                        </div>
                    )}

                    {this.props.folderDetails && (
                        <div className="file-uploaded" />
                    )}

                    {this.props.folderDetails && <div className="file-size" />}

                    {this.props.folderActions && (
                        <div className="file-actions">
                            <FolderActions
                                folder={folder}
                                deleteDisabled={shareInProgress}
                                onMenuClick={this.onMenuClick}
                                onMenuHide={this.onMenuHide}
                                onActionInProgress={this.onActionInProgress}
                            />
                        </div>
                    )}

                    {showNavigation && (
                        <Button
                            icon="keyboard_arrow_right"
                            onClick={this.onClickFolder}
                        />
                    )}
                </div>

                {shareInProgress && (
                    <div className="row sub-row">
                        <div className="file-checkbox" />

                        <div className="file-icon">
                            <CustomIcon icon="stacked-files" hover />
                        </div>

                        <div className="file-name">
                            <T k="title_filesInQueue" />
                        </div>

                        <div className="file-owner">
                            <T k="title_sharingFiles" />
                        </div>

                        <div className="file-uploaded" />
                        <div className="file-size" />
                        <div className="file-actions" />
                    </div>
                )}

                {shareInProgress && (
                    <ProgressBar
                        type="linear"
                        mode="determinate"
                        value={progress}
                        max={progressMax}
                    />
                )}

                {this.props.folderDetails && (
                    <ContactProfile
                        ref={this.setContactProfileRef}
                        contact={this.clickedContact}
                    />
                )}
            </div>
        );
    }
}

module.exports = FolderLine;
