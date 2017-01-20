const electron = require('electron');
const path = require('path');
const fs = require('fs');

let filePath, fileOpts;

function init(appName) {
    const app = electron.app || electron.remote.app;
    const folder = app.getPath('userData');
    filePath = path.join(folder, `${appName.toLowerCase()}_tinydb.json`);
    fileOpts = { encoding: 'utf8' };

    if (!fs.existsSync(filePath)) {
        if (!fs.existsSync(folder)) fs.mkdirSync(folder);
        fs.writeFileSync(filePath, '{}', fileOpts);
    }
}

/**
 * Get a value by key
 * @param {String} key
 * @returns {String}
 */
function get(key) {
    const settings = load();
    return settings[key];
}

function getValueAsync(key) {
    return Promise.resolve(get(key));
}

/**
 * Set a value for key.
 * @param {String} key
 * @param {Object} value -- JSON serializable object
 */
function set(key, value) {
    const settings = load();
    settings[key] = value;
    save(settings);
    return value;
}

function setValueAsync(key, value) {
    return Promise.resolve(set(key, value));
}

/**
 * Remove a key.
 * @param {String} key
 * @returns {void}
 */
function remove(key) {
    const settings = load();
    delete settings[key];
    save(settings);
}

/**
 * Async remove a key.
 * @param {String} key
 * @returns {Promise}
 */
function removeAsync(key) {
    return Promise.resolve(remove(key));
}

function getAllKeys() {
    return Object.keys(load());
}

function getAllKeysAsync() {
    return Promise.resolve(getAllKeys());
}

function load() {
    return JSON.parse(fs.readFileSync(filePath, fileOpts));
}

function save(settings) {
    fs.writeFileSync(filePath, JSON.stringify(settings), fileOpts);
}


module.exports = { get, set, remove, getValueAsync, setValueAsync, removeAsync, getAllKeysAsync, init };
