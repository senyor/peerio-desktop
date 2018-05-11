const { contactStore, chatStore, fileStore } = require('peerio-icebear');
const { getAttributeInParentChain } = require('./dom');
const { when } = require('mobx');

function getFolderByEvent(ev) {
    const folderId = getAttributeInParentChain(ev.target, 'data-folderid');
    const storeId = getAttributeInParentChain(ev.target, 'data-storeid');
    const store = fileStore.getFileStoreById(storeId);
    return folderId === 'root' ? store.folderStore.root : store.folderStore.getById(folderId);
}

function getFileByEvent(ev) {
    const fileId = getAttributeInParentChain(ev.target, 'data-fileid');
    const storeId = getAttributeInParentChain(ev.target, 'data-storeid');
    const store = fileStore.getFileStoreById(storeId);
    return store.getById(fileId);
}

async function getChannelByEvent(ev) {
    return chatStore.getChatWhenReady(getAttributeInParentChain(ev.target, 'data-channelid'));
}

async function getContactByEvent(ev) {
    const contact = contactStore.getContact(getAttributeInParentChain(ev.target, 'data-username'));
    return new Promise(resolve => when(() => !contact.loading, () => resolve(contact)));
}

module.exports = { getFolderByEvent, getFileByEvent, getChannelByEvent, getContactByEvent };
