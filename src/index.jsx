// @flow
require.extensions['.css'] = function(m, f) {
    m.exports = require(f.replace('.css', '.json'));
};
const React = require('react');
const { render } = require('react-dom');
const { Router, hashHistory } = require('react-router');
const routes = require('./routes');

render(<Router history={hashHistory} routes={routes} />, document.getElementById('root'));
