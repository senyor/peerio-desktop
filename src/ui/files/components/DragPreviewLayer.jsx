// @ts-check
const React = require('react');
const { DragLayer } = require('react-dnd');
const DragPreview = require('./DragPreview');
const DragDropTypes = require('../helpers/dragDropTypes');
const { getAllDraggedItems } = require('../helpers/dragDropHelpers');

function getItemStyles(props) {
    const { currentOffset } = props;
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }

    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform
    };
}

/**
 * @augments {React.Component<{
        itemType?: any,
        isDragging?: boolean
        currentOffset?: { x: number, y: number }
        canDrop?: boolean
    }, {}>}
 */
@DragLayer(monitor => {
    const isDragging = monitor.isDragging();

    // There's currently no simple way to detect whether we're over a valid drop
    // target in the preview layer without iterating over potential targets. See
    // https://github.com/react-dnd/react-dnd/issues/448
    let canDrop = false;
    if (isDragging) {
        /** @type {any} */ const m = monitor; // bad typings
        canDrop = m
            .getTargetIds()
            .some(
                target => m.isOverTarget(target) && m.canDropOnTarget(target)
            );
    }

    return {
        itemType: monitor.getItemType(),
        currentOffset: monitor.getClientOffset(),
        isDragging,
        canDrop
    };
})
class DragPreviewLayer extends React.Component {
    render() {
        const { isDragging, canDrop, itemType } = this.props;

        if (!isDragging) {
            return null;
        }

        if (itemType === DragDropTypes.NATIVEFILE) {
            return null;
        }

        const { files, folders } = getAllDraggedItems();

        return (
            <div className="files-dragpreviewlayer">
                <div style={getItemStyles(this.props)}>
                    <DragPreview
                        files={files}
                        folders={folders}
                        canDrop={canDrop}
                    />
                </div>
            </div>
        );
    }
}

module.exports = DragPreviewLayer;
