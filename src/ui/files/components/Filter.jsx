const React = require('react');
const { IconMenu, MenuItem } = require('~/react-toolbox');
const { t } = require('peerio-translator');

function Filter() {
    return (
        <div className="header-filter">All files
            <IconMenu icon="filter_list">
                <MenuItem value="all-files" caption={t('title_fileFilterAll')} />
                <MenuItem value="shared-by-me" caption={t('title_fileFilterShared')} />
                <MenuItem value="shared-with-me" caption={t('title_fileFilterReceived')} />
            </IconMenu>
        </div>
    );
}

module.exports = Filter;
