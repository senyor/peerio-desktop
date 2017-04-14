const React = require('react');

function a(text, url) {
    return <a href={url}>{text}</a>;
}

function b(text) {
    return <strong>{text}</strong>;
}

function i(text) {
    return <i>{text}</i>;
}

module.exports = {
    a, b, i
};
