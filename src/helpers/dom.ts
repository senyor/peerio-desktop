// TODO: remove all uses of this

/**
 * Looks for an attribute value in html element's parent chain. Starts checks
 * from the element itself.
 * @deprecated just create a React component if you need to associate data with
 *             an element. that's what React is for!
 * @param element - html element
 * @param attribute - attribute name
 * @returns found attribute value or null
 */
export function getAttributeInParentChain(element: Element, attribute: string): string | null {
    let el = element;

    while (el) {
        const ret = el.getAttribute(attribute);
        if (ret) return ret;
        el = el.parentElement;
    }
    return null;
}
