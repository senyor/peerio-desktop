const electron = require('electron').remote;


function requestDownloadPath(fileName) {
    return new Promise((resolve, reject) => {
        let path = fileName;
        try {
            const downloadsDir = electron.app.getPath('downloads');
            path = `${downloadsDir}/${path}`;
        } catch (err) {
            console.log(err);
        }

        const win = electron.getCurrentWindow();
        electron.dialog.showSaveDialog(
            win,
            { defaultPath: path },
            fileSavePath => {
                if (fileSavePath) resolve(fileSavePath);
                else reject();
            });
    });
}

// todo: do this in a mobx reaction
function downloadFile(file) {
    let finalPath;
    return requestDownloadPath(file.name)
           .then(path => {
               finalPath = path;
               return file.download(path);
           })
           .then(() => electron.app.dock && electron.app.dock.downloadFinished(finalPath));
}

function pickSystemFiles() {
    return new Promise(resolve => {
        const win = electron.getCurrentWindow();
        electron.dialog.showOpenDialog(win, { properties: ['openFile', 'showHiddenFiles'] }, resolve);
    });
}

module.exports = { downloadFile, pickSystemFiles };
