const React = require('react');
const { IconMenu, MenuItem, MenuDivider } = require('~/react-toolbox');
const { t } = require('peerio-translator');


function FolderActions(props) {
    return (
        <div className="item-actions" onClick={props.onRowClick}>
            <IconMenu icon="more_vert">
                {/* <MenuItem caption={t('button_move')}
                    onClick={props.onMove}
                    className="custom-icon button-move" /> */}
                <MenuItem caption={t('button_rename')}
                    icon="mode_edit"
                    onClick={props.onRename} />
                <MenuDivider />
                <MenuItem caption={t('button_delete')}
                    icon="delete"
                    onClick={props.onDelete} />
            </IconMenu>
        </div>
    );
}

module.exports = FolderActions;
