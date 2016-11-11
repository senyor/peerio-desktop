const React = require('react');
const { withRouter } = require('react-router');
const { Component } = require('react');
const { Checkbox, IconButton, IconMenu, MenuItem } = require('react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const Search = require('../components/Search');
const css = require('classnames');

@observer class Files extends Component {
    // TODO make dynamic based on file(s) selected
    @observable active = true;
    @observable checked = false;

    render() {
        return (
            <div className="files">
                <div className="table-wrapper">
                    <div className="header-filter">All files
                        <IconMenu icon="filter_list">
                            <MenuItem>Filter 1</MenuItem>
                        </IconMenu>
                    </div>
                    <div className="shadow-2">
                        <div className="table-action-bar">
                            <div>0 selected</div>
                            <div className="table-actions">
                                <IconButton icon="cloud_upload"
                        className={css({ active: this.active })} />
                                <IconButton icon="file_download"
                        className={css({ active: this.active })} />
                                <IconButton icon="reply"
                        className={css('reverse-icon', { active: this.active })} />
                                <IconButton icon="create_new_folder"
                        className={css({ active: this.active })} />
                                <IconButton icon="delete"
                        className={css({ active: this.active })} />
                            </div>
                            <Search />
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th><Checkbox checked={this.checked} /></th>
                                    <th>Name</th>
                                    <th>Owner</th>
                                    <th>Modified</th>
                                    <th>Size</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><Checkbox checked={!this.checked} /></td>
                                    <td>A some what long file name</td>
                                    <td>Jeff Jefferson</td>
                                    <td>Oct 20 2016</td>
                                    <td>400MB</td>
                                    <td>MPEG</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = withRouter(Files);
