const { fileStore } = require('peerio-icebear');
const { getAttributeInParentChain } = require('./dom');

function getFolderByEvent(ev) {
    const folderId = getAttributeInParentChain(ev.target, 'data-folderid');
    // TODO: add unique id for root folder
    return folderId === 'root' ? fileStore.folders.root : fileStore.folders.getById(folderId);
}

function getFileByEvent(ev) {
    return fileStore.getById(getAttributeInParentChain(ev.target, 'data-fileid'));
}

module.exports = { getFolderByEvent, getFileByEvent };
