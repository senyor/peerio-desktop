// @ts-check
const { NativeTypes } = require('react-dnd-html5-backend');

/**
 * explicit typing (that isn't needed for Real Typescript) so that the export
 * only permits the specified keys rather than any key
 * @type {{ FILE: symbol, FOLDER: symbol, NATIVEFILE: string }}
 */
module.exports = {
    FILE: Symbol('file'),
    FOLDER: Symbol('folder'),
    NATIVEFILE: NativeTypes.FILE
};
