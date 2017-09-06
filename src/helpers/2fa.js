const noSpaceRegex = /\s+/g;

/**
 * Checks if totp code (or backup code) is ready to submit
 * @param {string} code
 * @returns {{isBackupCode:bool, readyToSubmit:bool}}
 */
function validateCode(code) {
    code = code.replace(noSpaceRegex, ''); // eslint-disable-line
    const res = {};
    if (code.includes('-')) {
        res.isBackupCode = true;
        if (code.length >= 19) {
            res.readyToSubmit = true;
        }
        return res;
    }
    if (code.length >= 6) {
        res.readyToSubmit = true;
    }
    return res;
}

module.exports = { validateCode };
