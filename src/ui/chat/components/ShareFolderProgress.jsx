const React = require('react');
const { observer } = require('mobx-react');

const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const css = require('classnames');

const { MaterialIcon, ProgressBar } = require('~/peer-ui');

@observer
class ShareFolderProgress extends React.Component {
    render() {
        const folder = {
            name: 'Folder name A',
            shareProgress: 100
        };

        return (
            <div className="share-folder-progress">
                <div className="info">
                    <MaterialIcon icon="folder" />
                    <div className="text">
                        <T k="title_sharing" tag="span" />&nbsp;
                        <span>{folder.name}</span>&nbsp;
                        <span className="items-left">({t('title_itemsLeft', { number: 4 })})</span>
                    </div>
                    <div className="percent-progress">
                        <span>{`${folder.shareProgress}%`}</span>
                        <MaterialIcon icon="check"
                            className={css(
                                'affirmative',
                                { hide: folder.shareProgress < 100 }
                            )}
                        />
                    </div>
                </div>
                <ProgressBar value={folder.shareProgress} max="100" />
            </div>
        );
    }
}

module.exports = ShareFolderProgress;
