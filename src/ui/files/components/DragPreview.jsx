// @ts-check
const React = require('react');
const css = require('classnames');
const { t } = require('peerio-translator');
const { MaterialIcon } = require('peer-ui');
const FileSpriteIcon = require('~/ui/shared-components/FileSpriteIcon');

/**
 * @augments {React.Component<{
        files: any[]
        folders: any[]
        canDrop: boolean
    }, {}>}
 */
class DragPreview extends React.Component {
    render() {
        const { canDrop, files, folders } = this.props;

        const filesAndFoldersCount = files.length + folders.length;

        let displayName;
        let iconComponent;
        if (filesAndFoldersCount === 1) {
            if (files.length > 0) {
                displayName = files[0].name;
                iconComponent = (<FileSpriteIcon
                    type={files[0].iconType}
                    size="medium"
                />);
            } else {
                displayName = folders[0].name;
                iconComponent = <MaterialIcon icon="folder" />;
            }
        } else {
            displayName = t('title_draggingMultipleItems', { count: filesAndFoldersCount });
            iconComponent = (<FileSpriteIcon
                type="other"
                size="medium"
            />);
        }

        return (
            <div className={css('files-dragpreview', { 'can-drop': canDrop })}>
                <div className="body">
                    <div className="file-icon">
                        {iconComponent}
                    </div>
                    <div className="file-description">
                        {displayName}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = DragPreview;
