const React = require('react');
const { Route, IndexRoute } = require('react-router');
const App = require('./App');
const Root = require('./Root');
const Login = require('./login/Login');
const Signup = require('./signup/Signup');
const Messages = require('./messages/Messages');
const NewMessage = require('./messages/NewMessage');
const Files = require('./files/Files');
const Settings = require('./settings/Settings');
const DevTools = require('./dev-tools/DevTools');
const DTDashboard = require('./dev-tools/Dashboard');
const KegEditor = require('./dev-tools/KegEditor');

module.exports = (
    <Route path="/" component={Root}>
        <IndexRoute component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/app" component={App} >
            <IndexRoute component={Messages} />
            <Route path="new-message" component={NewMessage} />
            <Route path="files" component={Files} />
            <Route path="settings" component={Settings} />
        </Route>
        <Route path="/dev-tools" component={DevTools} >
            <IndexRoute component={DTDashboard} />
            <Route path="kegs" component={KegEditor} />
        </Route>
    </Route>
);
