const React = require('react');
const { TooltipIconButton } = require('~/react-toolbox');
const Search = require('~/ui/shared-components/Search');
const css = require('classnames');
const { fileStore } = require('~/icebear');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');

const delay = 500;

@observer
class GlobalActions extends React.Component {
    handleSearch = val => {
        if (val === '') {
            fileStore.clearFilter();
            return;
        }
        fileStore.filterByName(val);
    };

    render() {
        return (
            <div className="table-action-bar">
                <div className="no-select">{fileStore.selectedCount} {t('title_selected')}</div>
                <div className="table-actions">
                    <TooltipIconButton
                        tooltip={t('button_upload')}
                        tooltipDelay={delay}
                        tooltipPosition="top"
                        icon="cloud_upload"
                        className="active"
                        onClick={this.props.onUpload} />
                    {/* <TooltipIconButton*/}
                    {/* tooltip="Download"*/}
                    {/* tooltipDelay={delay}*/}
                    {/* tooltipPosition="top"*/}
                    {/* icon="file_download"*/}
                    {/* className={css({ active: true, disabled: true })} />*/}
                    <TooltipIconButton
                        tooltip={t('button_share')}
                        tooltipDelay={delay}
                        tooltipPosition="top"
                        icon="reply"
                        className={css('reverse-icon', 'active', { disabled: !fileStore.hasSelectedShareableFiles })}
                        onClick={this.props.onShare}
                    />
                    {/* <TooltipIconButton*/}
                    {/* tooltip="Add to folder"*/}
                    {/* tooltipDelay={delay}*/}
                    {/* tooltipPosition="top"*/}
                    {/* icon="create_new_folder"*/}
                    {/* className={css({ active: false, disabled: true })} />*/}
                    <TooltipIconButton
                        tooltip={t('button_delete')}
                        tooltipDelay={delay}
                        tooltipPosition="top"
                        icon="delete"
                        className={css('active', { disabled: !fileStore.hasSelectedFiles })}
                        onClick={this.props.onDelete}
                    />
                </div>
                <Search onChange={this.handleSearch} query={fileStore.currentFilter} />
            </div>
        );
    }
}

module.exports = GlobalActions;
