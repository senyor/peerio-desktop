const React = require('react');
const { Route, IndexRoute } = require('react-router');
const App = require('./views/App');
const Root = require('./views/Root');
const Login = require('./views/Login');
const Signup = require('./views/Signup');
const Empty = require('./views/Empty');

module.exports = (
    <Route path="/" component={Root}>
        <IndexRoute component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/app" component={App} >
            <IndexRoute component={Empty} />
        </Route>
    </Route>
);
