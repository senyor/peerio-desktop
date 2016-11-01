const electron = require('electron');
const path = require('path');
const fs = require('fs');

const app = electron.app || electron.remote.app;
const filePath = path.join(app.getPath('userData'), 'icebear_tinydb.json');
const fileOpts = { encoding: 'utf8' };

if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}', fileOpts);

/**
 *
 * @param key
 * @returns {Promise.<T>}
 */
function getValue(key) {
    const settings = load();
    return settings[key];
}

function getValueAsync(key) {
    return Promise.resolve(getValue(key));
}

/**
 *
 * @param key
 * @param value
 * @returns {Promise.<*>}
 */
function setValue(key, value) {
    const settings = load();
    settings[key] = value;
    save(settings);
    return value;
}

function setValueAsync(key, value) {
    return Promise.resolve(setValue(key, value));
}

function load() {
    return JSON.parse(fs.readFileSync(filePath, fileOpts));
}

function save(settings) {
    fs.writeFileSync(filePath, JSON.stringify(settings), fileOpts);
}

module.exports = { getValue, setValue, getValueAsync, setValueAsync };
