const React = require('react');
const { Route, IndexRoute } = require('react-router');
const App = require('./views/App');
const Root = require('./views/Root');
const Login = require('./views/Login');
const Signup = require('./views/Signup');
const Messages = require('./views/Messages');
const NewMessage = require('./views/NewMessage');

module.exports = (
    <Route path="/" component={Root}>
        <IndexRoute component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/app" component={App} >
            <IndexRoute component={Messages} />
            <Route path="/new-message" component={NewMessage} />
        </Route>
    </Route>
);
