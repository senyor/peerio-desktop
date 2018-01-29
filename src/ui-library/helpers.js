// Helper functions for PeerUI library

/**
 * Finds a HTML element's width, height, and position (measured at its center point, relative to the window).
 * @param {Object} element - HTML element
 * @returns {Object}
 */
function getPositionInWindow(element) {
    const { width, height, left, top } = element.getBoundingClientRect();

    return {
        offsetX: width / 2,
        offsetY: height / 2,
        posX: left + (width / 2),
        posY: top + (height / 2)
    };
}

module.exports = {
    getPositionInWindow
};
