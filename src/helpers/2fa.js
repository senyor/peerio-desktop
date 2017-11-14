const noSpaceRegex = /\s+/g;

/**
 * Checks if totp code (or backup code) is ready to submit
 * @param {string} code
 * @returns {{isBackupCode:bool, readyToSubmit:bool}}
 */
function validateCode(code) {
    /* eslint-disable no-param-reassign */
    code = code || '';
    code = code.toString();
    code = code.replace(noSpaceRegex, '');
    /* eslint-enable no-param-reassign */
    const res = { isBackupCode: false, readyToSubmit: false };
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
