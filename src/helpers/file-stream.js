const { FileStreamAbstract, errors } = require('~/icebear');
const fs = require('fs');

// todo prevent sequential read/write while in progress
class FileStream extends FileStreamAbstract {

    constructor(filePath, mode, bufferSize) {
        super(filePath, mode, bufferSize);
        // fs works with Buffer instances so we create
        // private buffer based on same chunk of RAM (ArrayBuffer) as public buffer
        if (this.buffer) this._buffer = Buffer.from(this.buffer.buffer);
    }

    checkForError(err, rejectFn) {
        if (err) {
            rejectFn(errors.normalize(err));
            return true;
        }
        return false;
    }

    open() {
        return new Promise((resolve, reject) => {
            fs.open(this.filePath, this.mode[0], (err, fd) => {
                if (this.checkForError(err, reject)) return;
                this.fileDescriptor = fd;
                fs.fstat(fd, (sErr, stat) => {
                    if (this.checkForError(sErr, reject)) return;
                    resolve(stat.size);
                });
            });
        });
    }

    close() {
        if (this.fileDescriptor == null) return Promise.resolve();
        return new Promise((resolve, reject) => {
            fs.close(this.fileDescriptor, err => {
                if (this.checkForError(err, reject)) return;
                resolve();
            });
        });
    }

    /**
     *
     * @return {Promise<number>}
     */
    readInternal() {
        return new Promise((resolve, reject) => {
            fs.read(this.fileDescriptor, this._buffer, 0, this._buffer.byteLength, null,
                (err, bytesRead) => {
                    if (this.checkForError(err, reject)) return;
                    resolve(bytesRead);
                });
        });
    }

    /**
     * @param {Uint8Array} buffer
     * @return {Promise}
     */
    writeInternal(buffer) {
        return new Promise((resolve, reject) => {
            fs.write(this.fileDescriptor, Buffer.from(buffer), 0, buffer.length, null,
                err => {
                    if (this.checkForError(err, reject)) return;
                    resolve();
                });
        });
    }
}

module.exports = FileStream;
