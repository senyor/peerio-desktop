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

/**
 * Returns html element in parent chain that has a certain class.
 * @param {Object} element - html element
 * @param {string} attribute - attribute name
 * @returns {Object} found html element or null
 */
function getParentWithClass(element, className) {
    let el = element;

    while (el) {
        const attr = el.classList.contains(className);
        if (attr) return el;
        el = el.parentElement;
    }
    return null;
}

/**
 * Finds all 'data-...' props of an instance of a component
 * @param {Object} - props from component
 * @returns {Object}
 */
function getDataProps(props) {
    const dataProps = {};

    Object.keys(props).filter(p => p.startsWith('data-')).forEach(key => {
        dataProps[key] = props[key];
    });

    return dataProps;
}

module.exports = {
    getAttributeInParentChain,
    getParentWithClass,
    getDataProps
};
