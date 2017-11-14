const fs = require('fs');
const { execSync } = require('child_process');

try {
    let existing, existingApp;

    try {
        existing = fs.readFileSync('.package.json.md5');
        existingApp = fs.readFileSync('.app.package.json.md5');
    } catch (ex) {
        // don't care
    }

    const actual = execSync(process.platform === 'darwin' ? 'md5 -q package.json' : 'md5sum package.json');
    const actualApp = execSync(process.platform === 'darwin' ? 'md5 -q app/package.json' : 'md5sum app/package.json');

    if (existing.toString() !== actual.toString() || existingApp.toString() !== actualApp.toString()) {
        console.log('package.json has changed, running npm install.');
        execSync('npm install');
    } else {
        console.log('package.json has not changed, skipping npm install.');
    }
} catch (ex) {
    console.error(ex);
}
