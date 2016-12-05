/* eslint no-debugger:0*/
module.exports = function() {
    if (process.env.DEBUG) {
        debugger;
    }
};
