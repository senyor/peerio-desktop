const { contactStore } = require('peerio-icebear');

function getContactInContext(query, context) {
    const c = contactStore.getContact(query);

    if (context) {
        if (context.includes(c.appLabel)) return c;
        return { notFound: true };
    }
    return c;
}

module.exports = {
    getContactInContext
};

