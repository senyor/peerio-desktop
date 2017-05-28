
function getHeaders(url) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        let resolved = false;
        req.onreadystatechange = () => {
            switch (req.readyState) {
                case 1:
                    req.send();
                    break;
                case 2:
                    resolved = true;
                    resolve(parseResponseHeaders(req.getAllResponseHeaders()));
                    req.abort();
                    break;
                case 4:
                    // in case we got to DONE(4) without receiving headers
                    if (!resolved) reject(new Error(`${url} request failed`));
                    break;
                default: break;
            }
        };
        req.open('GET', url);
    }).timeout(20000);
}

function parseResponseHeaders(headerStr) {
    const headers = {};
    if (!headerStr) {
        return headers;
    }
    const headerPairs = headerStr.split('\u000d\u000a');
    for (let i = 0; i < headerPairs.length; i++) {
        const headerPair = headerPairs[i];
        // Can't use split() here because it does the wrong thing
        // if the header value has the string ": " in it.
        const index = headerPair.indexOf(': ');
        if (index > 0) {
            const key = headerPair.substring(0, index);
            const val = headerPair.substring(index + 2);
            headers[key] = val;
        }
    }
    return headers;
}

module.exports = { getHeaders };
