/**
 * Looks for an attribute value in html element's parent chain.
 * Starts checks from the element itself.
 * @param {Object} element - html element
 * @param {string} attribute - attribute name
 * @returns {string|null} found attribute value or null
 */
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
