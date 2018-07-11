// @ts-check
const { fileStore } = require('peerio-icebear');
const { getFileTree } = require('~/helpers/file');

/**
 * @returns {{ filesOrFolders: any[], files: any[], folders: any[] }}
 */
function getAllDraggedItems() {
    return {
        filesOrFolders: fileStore.selectedFilesOrFolders,
        files: fileStore.selectedFiles,
        folders: fileStore.selectedFolders
    };
}

/**
 * @param {{ path: string }[]} files
 * @param {any} targetFolder
 */
async function uploadDroppedFiles(files, targetFolder) {
    const trees = files
        .map(f => f.path)
        .map(getFileTree)
        .filter(tree => tree);

    // @ts-ignore can't specify bluebird typings without ts
    await Promise.map(trees, tree => {
        if (typeof tree === 'string') {
            return fileStore.upload(tree, null, targetFolder);
        }
        return fileStore.uploadFolder(tree, targetFolder);
    });
}

module.exports = {
    getAllDraggedItems,
    uploadDroppedFiles
};
