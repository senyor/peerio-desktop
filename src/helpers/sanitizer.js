const DOMPurify = require('dompurify');

const chatMsgOptions = {
    ALLOWED_TAGS: ['b', 'i'],
    ALLOWED_ATTR: []
};

function sanitizeChatMessage(msg) {
    return DOMPurify.sanitize(msg, chatMsgOptions);
}

module.exports = { sanitizeChatMessage };
