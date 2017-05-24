// const fs = require('fs');
// const path = require('path');

// const { app } = (require('electron').remote || require('electron'));
// const FileStream = require('~/icebear/models/files/node-file-stream');

// const MAX_LOG_FILE_SIZE = 1 * 1024 * 1024;

// /**
//  * File stream with dead simple rotation.
//  */
// class FileTransport extends L.Transport {
//     constructor(level) {
//         super(level);
//         console.log('constructing file trnsport');
//         let logFolder = app.getPath('userData');
//         if (!fs.existsSync(logFolder)) {
//             fs.mkdirSync(logFolder);
//         }
//         logFolder = path.join(logFolder, 'logs');
//         if (!fs.existsSync(logFolder)) {
//             fs.mkdirSync(logFolder);
//         }

//         const fileName = path.join(logFolder, 'recent.log');
//         console.log(fileName);
//         const archiveFileName = path.join(logFolder, 'archived.log');
//         const fd = fs.openSync(fileName, fs.existsSync(fileName) ? 'a' : 'w');
//         const s = fs.fstatSync(fd);
//         if (s.size > MAX_LOG_FILE_SIZE) {
//             if (fs.existsSync(archiveFileName)) fs.unlinkSync(archiveFileName);
//             fs.renameSync(fileName, archiveFileName);
//         }
//         this.stream = new FileStream(fileName, 'append');
//         this.stream.open();
//     }

//     write(msg) {
//         this.stream.write(Buffer.from(`${msg}\n`, 'utf8')); // TODO promise
//     }
// }

// const fileTransport = new FileTransport();
// L.addTransport('file', fileTransport, L.LEVELS.INFO);
