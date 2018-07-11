// @ts-check
const React = require('react');
const { DropTarget } = require('react-dnd');

const { fileStore, warnings } = require('peerio-icebear');
const { t } = require('peerio-translator');

const FolderLine = require('./FolderLine');

const DragDropTypes = require('../helpers/dragDropTypes');
const {
    getAllDraggedItems,
    uploadDroppedFiles
} = require('../helpers/dragDropHelpers');

const folderDropSpec = {
    drop(props, monitor) {
        if (monitor.getItemType() === DragDropTypes.NATIVEFILE) {
            uploadDroppedFiles(monitor.getItem().files, props.folder);
            return;
        }

        const { filesOrFolders } = getAllDraggedItems();
        const snackbarCopy = filesOrFolders.length === 1
            ? t('warning_oneFileOrFolderMoved', {
                fileOrFolderName: filesOrFolders[0].name,
                targetFolderName: props.folder.name
            })
            : t('warning_multipleFilesOrFoldersMoved', {
                count: filesOrFolders.length,
                targetFolderName: props.folder.name
            });

        if (props.folder.root.isShared) {
            (async () => {
                if (await props.confirmShare()) {
                    await fileStore.bulk.move(props.folder);
                    warnings.add(snackbarCopy);
                }
            })();
        } else {
            fileStore.bulk.move(props.folder);
            warnings.add(snackbarCopy);
        }
    },
    canDrop(props, monitor) {
        if (monitor.getItemType() !== DragDropTypes.NATIVEFILE) {
            // Currently our only restriction (beyond react-dnd's existing
            // restriction that drag-drop types must match) is that we can't drag a
            // folder into itself.
            if (getAllDraggedItems().folders.includes(props.folder)) {
                return false;
            }
        }
        return true;
    }
};

/**
 * HACK: defs are MIRRORED in FolderLine.jsx (since this extends those props to pass them through).
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
        folderActions?: true
        isDragging?: boolean,
        isBeingDraggedOver?: boolean,
        canBeDroppedInto?: boolean
    }} FolderLineProps
 */


/**
 * @augments {React.Component<{
        confirmShare: () => Promise<boolean>,
        connectDropTarget?: (el: JSX.Element) => JSX.Element,
        isBeingDraggedOver?: boolean,
        canBeDroppedInto?: boolean
    } & FolderLineProps, {}>}
 */
@DropTarget(
    [DragDropTypes.FILE, DragDropTypes.FOLDER, DragDropTypes.NATIVEFILE],
    folderDropSpec,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isBeingDraggedOver: monitor.isOver(),
        canBeDroppedInto: monitor.canDrop()
    })
)
class DroppableFolderLine extends React.Component {
    render() {
        const {
            connectDropTarget,
            isBeingDraggedOver,
            canBeDroppedInto,
            ...passthroughProps
        } = this.props;

        // react-dnd requires its connectors' children to be a native element
        // like <div> for some reason.
        return connectDropTarget(<div><FolderLine
            {...passthroughProps}
            isBeingDraggedOver={isBeingDraggedOver}
            canBeDroppedInto={canBeDroppedInto}
        /></div>);
    }
}

module.exports = DroppableFolderLine;
