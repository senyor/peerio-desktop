const React = require('react');
const { t } = require('peerio-translator');

function T(props) {
    return React.createElement('span', props.className ? { className: props.className } : null,
                                    ...t(props.k, props.children));
}

module.exports = T;
