const React = require('react');
const { IconButton } = require('react-toolbox');
const css = require('classnames');

const noop = (e) => { e.stopPropagation(); };

function FileActions(props) {
    return (
        <td className="item-actions" onClick={props.onRowClick}>
            <IconButton icon="file_download" onClick={noop}
                        className={css('active', { disabled: props.downloadDisabled })} />
            <IconButton icon="reply" onClick={noop}
                        className={css('active', 'reverse-icon', { disabled: props.shareDisabled })} />
            <IconButton icon="create_new_folder" onClick={noop}
                        className={css('active', { disabled: props.newFolderDisabled })} />
            <IconButton icon="delete" onClick={noop}
                        className={css('active', { disabled: props.deleteDisabled })} />
        </td>
    );
}

module.exports = FileActions;
