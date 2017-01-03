const React = require('react');
const { IconMenu, MenuItem } = require('~/react-toolbox');

function Filter() {
    return (
        <div className="header-filter">All files
            <IconMenu icon="filter_list">
                <MenuItem value="all-files" caption="All files" />
                <MenuItem value="shared-by-me" caption="Shared by me" />
                <MenuItem value="shared-with-me" caption="Shared with me" />
            </IconMenu>
        </div>
    );
}

module.exports = Filter;
