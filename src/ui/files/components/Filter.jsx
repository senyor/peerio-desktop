const React = require('react');
const { IconMenu, MenuItem } = require('react-toolbox');

function Filter() {
    return (
        <div className="header-filter">All files
            <IconMenu icon="filter_list">
                <MenuItem>My files</MenuItem>
                <MenuItem>Shared by me</MenuItem>
                <MenuItem>Shared with me</MenuItem>
            </IconMenu>
        </div>
    );
}

module.exports = Filter;
