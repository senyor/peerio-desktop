const DOMPurify = require('dompurify');

const chatMsgOptions = {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
};

function sanitizeChatMessage(msg) {
    return DOMPurify.sanitize(msg, chatMsgOptions);
}

module.exports = { sanitizeChatMessage };
