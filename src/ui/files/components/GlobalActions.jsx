const React = require('react');
const { IconButton, Tooltip } = require('~/react-toolbox');
const Search = require('~/ui/shared-components/Search');
const css = require('classnames');
const { fileStore } = require('~/icebear');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');

const TooltipIcon = Tooltip()(IconButton); //eslint-disable-line
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
                <div>{fileStore.selectedCount} {t('title_selected')}</div>
                <div className="table-actions">
                    <TooltipIcon
                        tooltip={t('button_upload')}
                        tooltipDelay={delay}
                        tooltipPosition="top"
                        icon="cloud_upload"
                        className="active"
                        onClick={this.props.onUpload} />
                    {/* <TooltipIcon*/}
                    {/* tooltip="Download"*/}
                    {/* tooltipDelay={delay}*/}
                    {/* tooltipPosition="top"*/}
                    {/* icon="file_download"*/}
                    {/* className={css({ active: true, disabled: true })} />*/}
                    <TooltipIcon
                        tooltip={t('button_share')}
                        tooltipDelay={delay}
                        tooltipPosition="top"
                        icon="reply"
                        className={css('reverse-icon', { active: true, disabled: !fileStore.hasSelectedFiles })}
                        onClick={this.props.onShare}
                    />
                    {/* <TooltipIcon*/}
                    {/* tooltip="Add to folder"*/}
                    {/* tooltipDelay={delay}*/}
                    {/* tooltipPosition="top"*/}
                    {/* icon="create_new_folder"*/}
                    {/* className={css({ active: false, disabled: true })} />*/}
                    <TooltipIcon
                        tooltip={t('button_delete')}
                        tooltipDelay={delay}
                        tooltipPosition="top"
                        icon="delete"
                        className={css({ active: true, disabled: !fileStore.hasSelectedFiles })}
                        onClick={this.props.onDelete}
                    />
                </div>
                <Search onChange={this.handleSearch} query={fileStore.currentFilter} />
            </div>
        );
    }
}

module.exports = GlobalActions;
