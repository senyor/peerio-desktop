function getAttributeInParentChain(element, attribute) {
    let el = element;

    while (el) {
        const ret = el.getAttribute(attribute);
        if (ret) return ret;
        el = el.parentElement;
    }
    return null;
}

module.exports = { getAttributeInParentChain };
