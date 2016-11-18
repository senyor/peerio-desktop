const React = require('react');
const { withRouter } = require('react-router');
const { Component } = require('react');
const { Checkbox, IconButton, IconMenu, MenuItem } = require('react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const Search = require('../shared_components/Search');
const css = require('classnames');
const {fileStore} = require('../../icebear');//eslint-disable-line
const electron = require('electron').remote;

@observer class Files extends Component {
    // TODO make dynamic based on file(s) selected
    @observable active = true;
    @observable checked = false;
    @observable shareable = false;
    @observable count = 10;

    upload() {
        let file = electron.dialog.showOpenDialog(
            electron.getCurrentWindow(),
            { properties: ['openFile', 'showHiddenFiles'] });
        if (!file || !file.length) return;
        file = file[0];
        fileStore.upload(file);
    }

    render() {
        return (
            <div className="files">
                <div className="table-wrapper">
                    <div className="header-filter">All files
                        <IconMenu icon="filter_list">
                            <MenuItem>Filter 1</MenuItem>
                        </IconMenu>
                    </div>
                    <div className="shadow-2 flex-col" style={{ maxHeight: 'calc(100vh - 84px)' }}>
                        <div className="table-action-bar">
                            <div>0 selected</div>
                            <div className="table-actions">
                                <IconButton icon="cloud_upload"
                                            className="active" onClick={this.upload} />
                                <IconButton icon="file_download"
                                            className={css({ active: this.active })} />
                                <IconButton icon="reply"
                                            className={css('reverse-icon', {
                                                active: this.active && this.shareable,
                                                disabled: !this.shareable
                                            })} />
                                <IconButton icon="create_new_folder"
                                            className={css({ active: this.active })} />
                                <IconButton icon="delete"
                                            className={css({ active: this.active })} />

                            </div>
                            <Search />
                        </div>
                        <div style={{
                            display: 'flex',
                            flexShrink: '1',
                            maxHeight: '100vh',
                            overflow: 'auto'
                        }}>
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
                                    <tr className="new-file">
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>I am a new shareable file</td>
                                        <td>Jeff Jefferson</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>

                                    <tr className="new-file">
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>Jeff Jefferson</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>

                                    <tr className="new-file">
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>I can be shared as well</td>
                                        <td>You</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>


                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>I am a new file that can't be shared</td>
                                        <td>Bob Roberts</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', {
                                                        active: this.active && this.shareable,
                                                        disabled: !this.shareable })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>Jeff Jefferson</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>Jeff Jefferson</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>You</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>


                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>Bob Roberts</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', {
                                                        active: this.active && this.shareable,
                                                        disabled: !this.shareable })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>Jeff Jefferson</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>Jeff Jefferson</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>You</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>


                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>Bob Roberts</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', {
                                                        active: this.active && this.shareable,
                                                        disabled: !this.shareable })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>Jeff Jefferson</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>Jeff Jefferson</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>You</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', { active: this.active })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>


                                    <tr>
                                        <td><Checkbox checked={!this.checked} /></td>
                                        <td>A some what long file name</td>
                                        <td>Bob Roberts</td>
                                        <td>Oct 20 2016</td>
                                        <td>400MB</td>
                                        <td>MPEG</td>
                                        <td className="item-actions">
                                            <IconButton icon="file_download"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="reply"
                                                    className={css('reverse-icon', {
                                                        active: this.active && this.shareable,
                                                        disabled: !this.shareable })} />
                                            <IconButton icon="create_new_folder"
                                                    className={css({ active: this.active })} />
                                            <IconButton icon="delete"
                                                    className={css({ active: this.active })} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="table-paging">
                            <div>Rows per page:</div>
                            {/* TODO make Dropdown work */}
                            {/* <Dropdown />*/}
                            <div>1-10 of 234</div>
                            <IconButton icon="chevron_left" />
                            <IconButton icon="chevron_right" />
                        </div>


                    </div>
                </div>
            </div>
        );
    }
}

module.exports = withRouter(Files);
