/*
 * Attach a function to fire on any user input event (keyup, mousemove, mouseup)
 * Basically a "user activity" listener
 */

export function addInputListener(fn: () => void): void {
    window.addEventListener('keyup', fn);
    window.addEventListener('mousemove', fn);
    window.addEventListener('mouseup', fn);
}

export function removeInputListener(fn: () => void): void {
    window.removeEventListener('keyup', fn);
    window.removeEventListener('mousemove', fn);
    window.removeEventListener('mouseup', fn);
}
