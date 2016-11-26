const React = require('react');
const { IconButton, ProgressBar } = require('react-toolbox');
const css = require('classnames');

const noop = (e) => { e.stopPropagation(); };

function FileActions(props) {
    return (
        <td className="item-actions">
            {props.downloadDisabled
                ? <ProgressBar type="circular" mode="indeterminate" multicolor className="processing-file" />
                : <IconButton icon="file_download" onClick={noop} />
            }
            <IconButton icon="reply" onClick={noop}
                        className={css('reverse-icon', { disabled: props.shareDisabled })} />
            <IconButton icon="create_new_folder" onClick={noop}
                        className={css({ disabled: props.newFolderDisabled })} />
            <IconButton icon="delete" onClick={props.onDelete}
                        className={css({ disabled: props.deleteDisabled })} />
        </td>
    );
}

module.exports = FileActions;
