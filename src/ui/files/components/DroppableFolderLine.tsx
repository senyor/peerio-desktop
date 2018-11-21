import React from 'react';
import { observer } from 'mobx-react';
import { DropTarget, DropTargetSpec } from 'react-dnd';

import { fileStore, warnings } from 'peerio-icebear';

import FolderLine, { FolderLineProps } from './FolderLine';

import DragDropTypes from '../helpers/dragDropTypes';
import { getAllDraggedItems, uploadDroppedFiles } from '../helpers/dragDropHelpers';

const folderDropSpec: DropTargetSpec<DroppableFolderLineProps> = {
    drop(props, monitor) {
        if (monitor.getItemType() === DragDropTypes.NATIVEFILE) {
            uploadDroppedFiles(monitor.getItem().files, props.folder);
            return;
        }

        const { filesOrFolders } = getAllDraggedItems();
        const snackbarCopyKey =
            filesOrFolders.length === 1
                ? 'warning_oneFileOrFolderMoved'
                : 'warning_multipleFilesOrFoldersMoved';
        const snackbarCopyParams =
            filesOrFolders.length === 1
                ? {
                      fileOrFolderName: filesOrFolders[0].name,
                      targetFolderName: props.folder.name
                  }
                : {
                      count: filesOrFolders.length,
                      targetFolderName: props.folder.name
                  };

        if (
            props.folder.root.isShared &&
            fileStore.selectedFilesOrFolders.some(item => item.store.isMainStore)
        ) {
            (async () => {
                if (await props.confirmShare()) {
                    await fileStore.bulk.move(props.folder);
                    warnings.add(snackbarCopyKey, null, snackbarCopyParams);
                }
            })();
        } else {
            fileStore.bulk.move(props.folder);
            warnings.add(snackbarCopyKey, null, snackbarCopyParams);
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

interface DroppableFolderLineProps extends FolderLineProps {
    confirmShare: () => Promise<boolean>;
    connectDropTarget?: (el: JSX.Element) => JSX.Element;
    isBeingDraggedOver?: boolean;
    canBeDroppedInto?: boolean;
}

@DropTarget(
    [DragDropTypes.FILE, DragDropTypes.FOLDER, DragDropTypes.NATIVEFILE],
    folderDropSpec,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isBeingDraggedOver: monitor.isOver(),
        canBeDroppedInto: monitor.canDrop()
    })
)
@observer
export default class DroppableFolderLine extends React.Component<DroppableFolderLineProps> {
    render() {
        const {
            connectDropTarget,
            isBeingDraggedOver,
            canBeDroppedInto,
            ...passthroughProps
        } = this.props;

        // react-dnd requires its connectors' children to be a native element
        // like <div> for some reason.
        return connectDropTarget(
            <div>
                <FolderLine
                    {...passthroughProps}
                    isBeingDraggedOver={isBeingDraggedOver}
                    canBeDroppedInto={canBeDroppedInto}
                />
            </div>
        );
    }
}
