// @ts-check
const React = require('react');
const { observable, computed, action } = require('mobx');
const { observer } = require('mobx-react');
const { Dialog, Input } = require('peer-ui');
const { t } = require('peerio-translator');
const { fileStore } = require('peerio-icebear');

/**
 * @augments {React.Component<{}, {}>}
 */
@observer
class AddOrRenameFolderDialog extends React.Component {
    /**
     * Reference to the promise resolver to allow the caller to await the dialog
     * closing. When the resolver is set to null, the dialog is hidden.
     *
     * @private
     * @type {() => void | null}
     */
    @observable.ref
    resolver = null;

    /**
     * @type {string}
     */
    @observable
    inputValue;

    /**
     * @type {React.RefObject<HTMLInputElement>}
     */
    inputRef = React.createRef()

    /**
     * The file or folder to rename.
     * If null, we're adding a new folder.
     */
    @observable.ref
    folderToRename = null;

    /**
     * @param {any?} fileOrFolder The file or folder to rename; if undefined,
     *                            we're adding a new folder.
     */
    @action.bound
    show(fileOrFolder) {
        if (fileOrFolder) {
            this.folderToRename = fileOrFolder;
            this.inputValue = fileOrFolder.name;
        } else {
            // TODO: to be added to icebear
            // this.inputValue = t('default_newFolderName');
            this.inputValue = '';
        }

        // focus the ref on next tick, since it won't be mounted until we've rerendered.
        setTimeout(() => {
            if (this.inputRef.current !== null) {
                this.inputRef.current.focus();
                this.inputRef.current.select();
            }
        });

        return new Promise(res => { this.resolver = res; });
    }

    @action.bound
    close() {
        this.resolver();
        this.resolver = null;
        this.inputValue = null;
        this.folderToRename = null;
    }

    /**
     * @returns {boolean}
     */
    @computed
    get canPerformAddOrRename() {
        return this.inputValue.trim().length > 0;
    }

    performRename = () => {
        if (this.canPerformAddOrRename) {
            this.folderToRename.rename(this.inputValue);
        }
        this.close();
    }

    performAddFolder = () => {
        if (this.canPerformAddOrRename) {
            fileStore.folderStore.currentFolder.createFolder(this.inputValue);
        }
        this.close();
    }

    @action.bound
    onInputChange(val) {
        this.inputValue = val;
    }

    onInputKeyDown = (ev) => {
        if (ev.key === 'Enter' && this.canPerformAddOrRename) {
            if (this.folderToRename) {
                this.performRename();
            } else {
                this.performAddFolder();
            }
        }
    }

    render() {
        if (!this.resolver) {
            return null;
        }

        const dialogActions = [
            { label: t('button_cancel'), onClick: this.close },
            this.folderToRename
                ? { label: t('button_rename'), disabled: !this.canPerformAddOrRename, onClick: this.performRename }
                : { label: t('button_create'), disabled: !this.canPerformAddOrRename, onClick: this.performAddFolder }
        ];

        return (
            <Dialog
                title={t(this.folderToRename ? 'button_rename' : 'button_newFolder')}
                active
                size="small"
                actions={dialogActions}
                onCancel={this.close}
                className="add-folder-popup"
            >
                <Input
                    // @ts-ignore peer-ui should use @types/react's existing declared ref type
                    innerRef={this.inputRef}
                    placeholder={t('title_folderName')}
                    value={this.inputValue}
                    onChange={this.onInputChange}
                    onKeyDown={this.onInputKeyDown}
                    autoFocus
                />
            </Dialog>);
    }
}

module.exports = AddOrRenameFolderDialog;
