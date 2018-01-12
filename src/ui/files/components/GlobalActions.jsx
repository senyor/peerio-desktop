const React = require('react');
const { Button } = require('~/peer-ui');
const Search = require('~/ui/shared-components/Search');
const { fileStore } = require('peerio-icebear');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');

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
                    <Button
                        tooltip={t('button_upload')}
                        tooltipPosition="top"
                        icon="cloud_upload"
                        className="active"
                        onClick={this.props.onUpload} />
                    {/* <TooltipIconButton */}
                    {/* tooltip="Download" */}
                    {/* tooltipPosition="top" */}
                    {/* icon="file_download" */}
                    {/* className={css({ active: true, disabled: true })} /> */}
                    <Button
                        tooltip={t('button_share')}
                        tooltipPosition="top"
                        icon="reply"
                        className="reverse-icon active"
                        disabled={!fileStore.canShareSelectedFiles}
                        onClick={this.props.onShare}
                    />
                    {/* NO MAIL YET. Uncomment when we have mail.  */}
                    {/* <TooltipIconButton
                        tooltip={t('button_shareViaMail')}
                        tooltipPosition="top"
                        icon="email"
                        className={css('active', { disabled: !fileStore.hasSelectedShareableFiles })}
                        onClick={this.props.onShare}
                    /> */}
                    {/* <TooltipIconButton */}
                    {/* tooltip="Add to folder" */}
                    {/* tooltipPosition="top" */}
                    {/* icon="create_new_folder" */}
                    {/* className={css({ active: false, disabled: true })} /> */}
                    <Button
                        tooltip={t('button_delete')}
                        tooltipPosition="top"
                        icon="delete"
                        className="active"
                        disabled={!fileStore.hasSelectedFiles}
                        onClick={this.props.onDelete}
                    />
                </div>
                <Search onChange={this.handleSearch} query={fileStore.currentFilter} />
            </div>
        );
    }
}

module.exports = GlobalActions;
