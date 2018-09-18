/*
 * Attach a function to fire on any user input event (keyup, mousemove, mouseup)
 * Basically a "user activity" listener
 */

import _ from 'lodash';

export function addInputListener(fn: () => void): void {
    window.addEventListener('keyup', fn);
    window.addEventListener('mousemove', _.throttle(fn, 100));
    window.addEventListener('mouseup', fn);
}

export function removeInputListener(fn: () => void): void {
    window.removeEventListener('keyup', fn);
    window.removeEventListener('mousemove', _.throttle(fn, 100));
    window.removeEventListener('mouseup', fn);
}
