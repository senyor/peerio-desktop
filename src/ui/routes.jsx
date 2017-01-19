const React = require('react');
const { Route, IndexRoute } = require('react-router');
const App = require('./App');
const Root = require('./Root');
const Login = require('./login/Login');
const Signup = require('./signup/Signup');
const Messages = require('./messages/Messages');
const NewMessage = require('./messages/NewMessage');
const Files = require('./files/Files');
const ShareFiles = require('./files/ShareFiles');
const Settings = require('./settings/Settings');
const Profile = require('./settings/components/ProfileSettings');
const Security = require('./settings/components/SecuritySettings');
const Preferences = require('./settings/components/Preferences');
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
            <Route path="sharefiles" component={ShareFiles} />
            <Route path="settings" component={Settings}>
                <Route path="profile" component={Profile} />
                <Route path="security" component={Security} />
                <Route path="preferences" component={Preferences} />
            </Route>
        </Route>
        <Route path="/dev-tools" component={DevTools} >
            <IndexRoute component={DTDashboard} />
            <Route path="kegs" component={KegEditor} />
        </Route>
    </Route>
);
