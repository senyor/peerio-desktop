const electron = require('electron');
const path = require('path');
const fs = require('fs');

const app = electron.app || electron.remote.app;
const fileOptions = { encoding: 'utf8' };

class KeyValueStorage {
    constructor(name) {
        this.name = name;
        const folder = app.getPath('userData');
        this.filePath = path.join(folder, `${name}_tinydb.json`);
        if (!fs.existsSync(this.filePath)) {
            if (!fs.existsSync(folder)) fs.mkdirSync(folder);
            fs.writeFileSync(this.filePath, '{}', fileOptions);
        }
    }
    // should return null if value doesn't exist
    getValue(key) {
        const data = this.load();
        // eslint-disable-next-line no-prototype-builtins
        return Promise.resolve(data.hasOwnProperty(key) ? data[key] : null);
    }
    setValue(key, value) {
        const data = this.load();
        data[key] = typeof value === 'undefined' ? null : value;
        this.save(data);
        return Promise.resolve();
    }
    removeValue(key) {
        const data = this.load();
        delete data[key];
        this.save(data);
        return Promise.resolve();
    }
    getAllKeys() {
        const data = this.load();
        const keys = Object.keys(data);
        return Promise.resolve(keys);
    }

    load() {
        return JSON.parse(fs.readFileSync(this.filePath, fileOptions));
    }

    save(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data), fileOptions);
    }
}


module.exports = KeyValueStorage;
