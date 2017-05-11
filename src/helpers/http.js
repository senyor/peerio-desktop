const http = require('http');
const https = require('https');
const URL = require('url');

function getHeaders(url) {
    return new Promise((resolve, reject) => {
        const options = Object.assign(URL.parse(url), { method: 'HEAD' });
        if (options.protocol !== 'http:' && options.protocol !== 'https:') {
            options.protocol = 'http:';
        }
        const req = (options.protocol === 'http:' ? http : https).request(options, res => resolve(res.headers));
        req.on('error', reject);
        req.end();
    }).timeout(60000);
}

module.exports = { getHeaders };
