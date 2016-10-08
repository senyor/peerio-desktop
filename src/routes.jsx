// @flow
const React = require('react');
const { Route, IndexRoute } = require('react-router');
const App = require('./containers/App');
const Login = require('./components/Login');

module.exports = (
  <Route path="/" component={App}>
      <IndexRoute component={Login} />
  </Route>
);
