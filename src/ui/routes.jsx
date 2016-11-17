const React = require('react');
const { Route, IndexRoute } = require('react-router');
const App = require('./App');
const Root = require('./Root');
const Login = require('./login/Login');
const Signup = require('./signup/Signup');
const Messages = require('./messages/Messages');
const NewMessage = require('./messages/NewMessage');
const Files = require('./files/Files');

module.exports = (
    <Route path="/" component={Root}>
        <IndexRoute component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/app" component={App} >
            <IndexRoute component={Messages} />
            <Route path="new-message" component={NewMessage} />
            <Route path="files" component={Files} />
        </Route>
    </Route>
);
