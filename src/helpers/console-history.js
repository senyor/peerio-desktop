
const safeJsonStringify = require('safe-json-stringify');

const originals = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    debug: console.debug
};

console.history = {
    cache: [],
    write(args) {
        let line = '';
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] === 'object') {
                line += `${safeJsonStringify(args[i])} `;
            } else {
                line += `${args[i]} `;
            }
        }
        this.cache.push(line);
        if (this.cache.length > 1050) {
            this.cache.splice(0, 50);
        }
    },
    toString() {
        return this.cache.join('\r\n');
    }

};

const h = console.history;

console.log = function(...args) {
    originals.log.apply(console, args);
    h.write(args);
};
console.warn = function(...args) {
    originals.warn.apply(console, args);
    h.write(args);
};
console.error = function(...args) {
    originals.error.apply(console, args);
    h.write(args);
};
console.debug = function(...args) {
    originals.debug.apply(console, args);
    h.write(args);
};
