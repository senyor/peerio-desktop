const React = require('react');
const { IconButton } = require('react-toolbox');
const Search = require('../../shared_components/Search');
const css = require('classnames');

function GlobalActions(props) {
    return (
        <div className="table-action-bar">
            <div>0 selected</div>
            <div className="table-actions">
                <IconButton icon="cloud_upload" className="active" onClick={props.onUpload} />
                <IconButton icon="file_download" className={css({ active: true })} />
                <IconButton icon="reply" className={css('reverse-icon',
                { active: true, disabled: true })} />
                <IconButton icon="create_new_folder" className={css({ active: true })} />
                <IconButton icon="delete" className={css({ active: true })} />
            </div>
            <Search />
        </div>
    );
}

module.exports = GlobalActions;
