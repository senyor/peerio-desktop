const electron = require('electron');
const normalizeError = require('../icebear/errors').normalize; //eslint-disable-line
const path = require('path');
const fs = require('fs');

const app = electron.app || electron.remote.app;
const filePath = path.join(app.getPath('userData'), 'icebear_tinydb.json');
const fileOpts = { encoding: 'utf8' };

const settings = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, fileOpts)) : {};

function get(key) {
    return settings[key];
}

function set(key, value) {
    settings[key] = value;
    save();
}

function save() {
    fs.writeFileSync(filePath, JSON.stringify(settings), fileOpts);
}

module.exports = { get, set };
