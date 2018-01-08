const { fileStore, contactStore, chatStore } = require('peerio-icebear');
const { getAttributeInParentChain } = require('./dom');
const { when } = require('mobx');

function getFolderByEvent(ev) {
    const folderId = getAttributeInParentChain(ev.target, 'data-folderid');
    // TODO: add unique id for root folder
    return folderId === 'root' ? fileStore.folders.root : fileStore.folders.getById(folderId);
}

function getFileByEvent(ev) {
    return fileStore.getById(getAttributeInParentChain(ev.target, 'data-fileid'));
}

async function getChannelByEvent(ev) {
    return chatStore.getChatWhenReady(getAttributeInParentChain(ev.target, 'data-channelid'));
}

async function getContactByEvent(ev) {
    const contact = contactStore.getContact(getAttributeInParentChain(ev.target, 'data-username'));
    return new Promise(resolve => when(() => !contact.loading, () => resolve(contact)));
}

module.exports = { getFolderByEvent, getFileByEvent, getChannelByEvent, getContactByEvent };
