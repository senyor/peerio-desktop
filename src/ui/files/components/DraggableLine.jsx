// @ts-check
const React = require('react');
const { runInAction } = require('mobx');
const { DragSource } = require('react-dnd');
const { getEmptyImage } = require('react-dnd-html5-backend');

const FileLine = require('./FileLine');
const DroppableFolderLine = require('./DroppableFolderLine');

const DragDropTypes = require('../helpers/dragDropTypes');
const { getAllDraggedItems } = require('../helpers/dragDropHelpers');
const {
    isFileOrFolderMoveable
} = require('../helpers/sharedFileAndFolderActions');

const fileOrFolderDragSpec = {
    beginDrag(props) {
        const initialSelectionState = props.fileOrFolder.selected;

        // the drag spec in theory shouldn't have side effects... but we already
        // need to rely on our singleton store/mutable global state to figure
        // out what we're dragging, so what's another log on the fire
        if (initialSelectionState === false) {
            runInAction(() => {
                props.fileOrFolder.selected = true;
            });
        }

        // in fact, that means we simply rely on our global selection state to
        // figure out where we can drop and what we're dropping, so the only
        // data we pass along here is whether the item was originally selected.
        return { initialSelectionState };
    },
    endDrag(props, monitor) {
        // we restore the selection state only if the drop wasn't handled.
        if (!monitor.didDrop()) {
            const { initialSelectionState } = monitor.getItem();
            if (initialSelectionState === false) {
                runInAction(() => {
                    props.fileOrFolder.selected = false;
                });
            }
        }
    },
    canDrag(props) {
        return isFileOrFolderMoveable(props.fileOrFolder);
    },
    isDragging(props) {
        return getAllDraggedItems().filesOrFolders.includes(props.fileOrFolder);
    }
};

// Due to limitations with react-dnd, we need a component that declares a shared
// DragSource spec to detect dragging multiple lines at the same time (otherwise
// isDragging would only get called for files OR folders, not a heterogeneous
// group of both.) We could probably alternately have hacked some stuff in to set
// additional shared state, but this ultimately seemed like a better solution.

/**
 * @augments {React.Component<{
        fileOrFolder: any,
        confirmShare: () => Promise<boolean>,
        connectDragPreview?: (image: HTMLImageElement) => void,
        connectDragSource?: (el: JSX.Element) => JSX.Element,
        isDragging?: boolean
    }, {}>}
 */
@DragSource(
    props =>
        props.fileOrFolder.isFolder ? DragDropTypes.FOLDER : DragDropTypes.FILE,
    fileOrFolderDragSpec,
    (connect, monitor) => ({
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    })
)
class DraggableLine extends React.Component {
    componentDidMount() {
        // Disable the built-in HTML5 drag preview -- we render our own with a custom DragLayer.
        const { connectDragPreview } = this.props;
        connectDragPreview(getEmptyImage());
    }

    render() {
        const {
            fileOrFolder: f,
            isDragging,
            connectDragSource,
            confirmShare
        } = this.props;

        return connectDragSource(
            <div>
                {f.isFolder ? (
                    <DroppableFolderLine
                        folder={f}
                        folderActions
                        folderDetails
                        checkbox={!f.isShared}
                        isDragging={isDragging}
                        confirmShare={confirmShare}
                    />
                ) : (
                    <FileLine
                        file={f}
                        fileActions
                        fileDetails
                        checkbox
                        isDragging={isDragging}
                    />
                )}
            </div>
        );
    }
}

module.exports = DraggableLine;
