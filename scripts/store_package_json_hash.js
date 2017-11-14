if (process.env.CI) return;

const { execSync } = require('child_process');

if (process.platform === 'darwin') {
    execSync('md5 -q package.json > .package.json.md5');
    execSync('md5 -q app/package.json > .app.package.json.md5');
} else {
    execSync('md5sum package.json > .package.json.md5');
    execSync('md5sum app/package.json > .app.package.json.md5');
}
