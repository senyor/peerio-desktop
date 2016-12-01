const React = require('react');
const { IconButton, ProgressBar, Tooltip } = require('react-toolbox');
const css = require('classnames');

const noop = (e) => { e.stopPropagation(); };

const TooltipIcon = Tooltip(IconButton); //eslint-disable-line

function FileActions(props) {
    const delay = 500;

    return (
        <td className="item-actions" onClick={props.onRowClick}>
            { props.downloadDisabled
                ? <ProgressBar type="circular" mode="indeterminate" multicolor className="processing-file" />
                : <TooltipIcon
                    tooltip="Download"
                    tooltipDelay={delay}
                    tooltipPosition="top"
                    icon="file_download"
                    onClick={props.onDownload}
                    className={css({ disabled: props.downloadDisabled })} />
            }
            <TooltipIcon
                tooltip="Share"
                tooltipDelay={delay}
                tooltipPosition="top"
                icon="reply"
                onClick={noop}
                className={css('reverse-icon', { disabled: props.shareDisabled })} />
            <TooltipIcon
                tooltip="Add to folder"
                tooltipDelay={delay}
                tooltipPosition="top"
                icon="create_new_folder"
                onClick={noop}
                className={css({ disabled: props.newFolderDisabled })} />
            <TooltipIcon
                tooltip="Delete"
                tooltipDelay={delay}
                tooltipPosition="top"
                icon="delete"
                onClick={props.onDelete}
                className={css({ disabled: props.deleteDisabled })} />

        </td>
    );
}

module.exports = FileActions;
