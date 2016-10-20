const React = require('react');
const { Route, IndexRoute } = require('react-router');
const App = require('./views/App');
const Login = require('./views/Login');
const Signup = require('./views/Signup');

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Login} />
        <Route path="/signup" component={Signup} />
    </Route>
);
