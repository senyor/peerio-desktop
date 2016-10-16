const storage = require('electron-json-storage');
const normalizeError = require('../icebear/errors').normalize; //eslint-disable-line

function get(key) {
    return new Promise((resolve, reject) => {
        storage.get(key, (err, data) => {
            if (err) {
                const error = normalizeError(err);
                console.error(error);
                reject(error);
            } else resolve(data);
        });
    });
}

function set(key, value) {
    return new Promise((resolve, reject) => {
        storage.set(key, value, err => {
            if (err) {
                const error = normalizeError(err);
                console.error(error);
                reject(error);
            } else resolve();
        });
    });
}

module.exports = { get, set };
