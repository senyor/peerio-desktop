const React = require('react');
const { IconMenu, MenuItem, MenuDivider, ProgressBar } = require('~/react-toolbox');
const css = require('classnames');
const { t } = require('peerio-translator');


function FileActions(props) {
    /* available props
        shareable: is file allowed to be shared
        shareDisabled: file download in progress, disable share button
        downloadDisabled: file download in progress, disable download button
        moveable: is file allowed to be moved
        renameable: is file allowed to be renamed
        deleteable: is file not allowed to be deleted
    */
    return (
        <div className="item-actions" onClick={props.onRowClick}>
            <IconMenu icon="more_vert">
                {props.downloadDisabled
                    ? <ProgressBar type="linear" mode="indeterminate" multicolor className="processing-file" />
                    : null }
                {props.shareable && <MenuItem caption={t('button_share')}
                    icon="reply"
                    onClick={props.onShare}
                    className={css('reverse-icon', { disabled: props.shareDisabled })} />
                }
                <MenuItem caption={t('title_download')}
                    icon="file_download"
                    onClick={props.onDownload}
                    className={css({ disabled: props.downloadDisabled })} />
                {props.moveable && <MenuItem caption={t('button_move')}
                    onClick={props.onMove}
                    className="custom-icon button-move" />
                }
                {props.renameable && <MenuItem caption={t('button_rename')}
                    icon="mode_edit"
                    onClick={props.onRename} />
                }
                {/* SHARE VIA MAIL ACTION no mail so it's commented out. */}
                {/* <MenuItem caption={t('button_shareViaMail')}
                        icon="email"
                        onClick={props.onShare}
                        className={css({ disabled: props.shareDisabled })} /> */}
                {/* <TooltipDiv */}
                {/* tooltip="Add to folder" */}
                {/* tooltipDelay={delay} */}
                {/* tooltipPosition="top" */}
                {/* icon="create_new_folder" */}
                {/* onClick={noop} */}
                {/* className={css({ disabled: props.newFolderDisabled })} /> */}
                {props.deleteable && <MenuDivider />}
                {props.deleteable && <MenuItem caption={t('button_delete')}
                    icon="delete"
                    onClick={props.onDelete} />}
            </IconMenu>
        </div>
    );
}

module.exports = FileActions;
