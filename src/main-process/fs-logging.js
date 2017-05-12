const fs = require('fs');
const config = require('~/config');
const L = require('l.js');

/**
 * File stream with dead simple rotation.
 */
class FileTransport extends L.Transport {
    constructor(level) {
        super(level);
        this.MAX_FILESIZE = 1000000;
        if (!fs.existsSync(config.nodeLogFolder)) fs.mkdirSync(config.nodeLogFolder);
        const fileName = `${config.nodeLogFolder}recent.log`;
        const archiveFileName = `${config.nodeLogFolder}archived.log`;
        const fd = fs.openSync(fileName, fs.existsSync(fileName) ? 'a' : 'w');
        const s = fs.fstatSync(fd);
        if (s.size > this.MAX_FILESIZE) {
            if (fs.existsSync(archiveFileName)) fs.unlinkSync(archiveFileName);
            fs.renameSync(fileName, archiveFileName);
        }
        this.stream = new config.FileStream(fileName, 'append');
        this.stream.open();
    }

    write(msg) {
        this.stream.write(Buffer.from(`${msg}\n`, 'utf8')); // TODO promise
    }
}

const fileTransport = new FileTransport();
L.addTransport('file', fileTransport, L.LEVELS.INFO);
