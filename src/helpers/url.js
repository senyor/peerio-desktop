const allowedProtocols = ['HTTP://', 'HTTPS://', 'MAILTO:'];
function isUrlAllowed(url) {
    if (typeof url !== 'string') return false;
    const URL = url.toLocaleUpperCase(url).trim();
    for (let i = 0; i < allowedProtocols.length; i++) {
        if (URL.startsWith(allowedProtocols[i])) return true;
    }
    return false;
}

module.exports = { isUrlAllowed };
