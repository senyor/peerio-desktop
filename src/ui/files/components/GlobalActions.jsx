const React = require('react');
const { IconButton, Tooltip } = require('react-toolbox');
const Search = require('~/ui/shared-components/Search');
const css = require('classnames');

const TooltipIcon = Tooltip(IconButton); //eslint-disable-line

function GlobalActions(props) {
    const delay = 500;

    return (
        <div className="table-action-bar">
            <div>0 selected</div>
            <div className="table-actions">
                <TooltipIcon
                    tooltip="Upload"
                    tooltipDelay={delay}
                    tooltipPosition="top"
                    icon="cloud_upload"
                    className="active"
                    onClick={props.onUpload} />
                <TooltipIcon
                    tooltip="Download"
                    tooltipDelay={delay}
                    tooltipPosition="top"
                    icon="file_download"
                    className={css({ active: true, disabled: true })} />
                <TooltipIcon
                    tooltip="Share"
                    tooltipDelay={delay}
                    tooltipPosition="top"
                    icon="reply"
                    className={css('reverse-icon', { disabled: true })} />
                <TooltipIcon
                    tooltip="Add to folder"
                    tooltipDelay={delay}
                    tooltipPosition="top"
                    icon="create_new_folder"
                    className={css({ active: false, disabled: true })} />
                <TooltipIcon
                    tooltip="Delete"
                    tooltipDelay={delay}
                    tooltipPosition="top"
                    icon="delete"
                    className={css({ active: false, disabled: true })} />
            </div>
            <Search />
        </div>
    );
}

module.exports = GlobalActions;
