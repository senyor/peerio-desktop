// @ts-check
const { action } = require('mobx');

const { User, fileStore } = require('peerio-icebear');

const { selectDownloadFolder } = require('~/helpers/file');

/**
 * Remember that these are just for play until we introduce real types -- any
 * non-primitive will satisfy these.
 *
 * @typedef {{
      isFolder: true
      [prop: string]: any
   }} Folder
 *
 * @typedef {{
      [prop: string]: any
   }} File
 *
 * @typedef {File | Folder} FileOrFolder
 */

/*
 * TODO: any of these that could be sensibly placed on the icebear models might
 * as well be there.
 *
 * in keeping with the OO style of icebear (such as it exists) it might make
 * sense to have augmented versions of the file/folder models for
 * environment-specific actions (eg. where we use dom or electron apis) in
 * desktop, mobile, etc., rather than static methods as in this file. that's
 * something that could be explored later.
 *
 * (this would also probably make a lot more sense for view-model properties
 * like "selected", etc., which currently just reside on the models proper.)
 */
class FilesAndFoldersSharedMethods {
    /**
     * @param {string} val
     * @returns {void}
     */
    @action
    static handleSearch(val) {
        fileStore.searchQuery = val;
    }

    /**
     * @param {FileOrFolder} fileOrFolder
     * @returns {boolean}
     */
    static isFileOrFolderMoveable(fileOrFolder) {
        // if the root folder doesn't have any folders in it, we can't move anything anywhere.
        if (!fileStore.folderStore.root.hasNested) return false;
        // if a folder is shared, it's not moveable.
        if (fileOrFolder.isFolder && fileOrFolder.isShared) return false;
        return true;
    }

    /**
     * @param {File} file
     * @returns {boolean}
     */
    static fileDownloadUIEnabled(file) {
        return file.readyForDownload && !file.downloading;
    }

    /**
     * @param {File} file
     * @returns {boolean}
     */
    static isFileShareable(file) {
        return file.readyForDownload && file.canShare;
    }

    static isFileDeleteable(file) {
        return file.fileOwner === User.current.username;
    }

    /**
     * @param {FileOrFolder} fileOrFolder
     */
    @action
    static toggleFileOrFolderSelected(fileOrFolder) {
        fileOrFolder.selected = !fileOrFolder.selected;
    }

    /**
     * @param {Folder} folder
     * @returns {Promise<void>}
     */
    static async downloadFolder(folder) {
        const path = await selectDownloadFolder();
        if (!path) return;
        fileStore.bulk.downloadOne(folder, path);
    }

    /**
     * @param {FileOrFolder} fileOrFolder
     * @returns {void}
     */
    static deleteFileOrFolder(fileOrFolder) {
        fileStore.bulk.removeOne(fileOrFolder);
    }

    /**
     * @param {Folder} folder
     * @returns {void}
     */
    @action
    static setCurrentFolder(folder) {
        if (folder !== fileStore.folderStore.currentFolder) {
            fileStore.folderStore.currentFolder = folder;
            fileStore.searchQuery = '';
            fileStore.clearSelection();
        }
    }
}

module.exports = FilesAndFoldersSharedMethods;
