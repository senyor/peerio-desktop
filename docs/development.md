# Development

## Local setup

Assuming you have nodejs and npm installed.

- Clone repository
- Set the environment variable `PEERIO_STAGING_SOCKET_SERVER` if you want to connect to a different server.
- Run `npm install` -- if it fails maybe run `npm install` in `app/` first
- Run `npm start` to run a development build.

## Linking the SDK

If you want to use a local development version of `peerio-icebear`, run `npm link` inside that project, then `cd app && npm link peerio-icebear && cd ..`.

**Beware:** Don't ever use a development SDK with production servers, especially not with your own account (you could break it permanently).

## Dependency management

Due to the 2-package.json structure, as well as other idiosyncracies, the following gotchas must be observed when adding dependencies to peerio-desktop:
1. If you add a dependency to peerio-icebear, you should add it to both the dependencies and peerDependencies of that project.
2. Only dependencies from `app/` will end up in a prod build, and they have to be added to `app/package.json` manually.

## git hooks

There are several git hooks configured, some of them are optional and you can opt in by creating `.opt-in` file in repository root (it's git ignored).
`.opt-in` file should contain optional hooks names one per line.
Add `link-sdk` to enable workaround for npm bug that removes linked repository. This hook will re-link icebear sdk after every `npm install`.
Add `lint` to run code validation before commit, commit will fail if there are any issues.
Add `npm-install` to never ever forget to run `npm install` after package.json was changed in result of branch change/merge/pull.

## Logging

In production builds, calls to `console` functions like `console.log` and
`console.err` will be transformed with our Babel plugin
[console-kungfu](https://github.com/PeerioTechnologies/babel-plugin-console-kungfu)
to add helpful information like filenames and line numbers.

## UI Tests

Tests run with Spectron.

### Writing tests

In development builds, there is a tool available for recording clicks and inputs. You can run `recordUI()`, and then `stopRecording()`, which will print the results. There are at least a few caveats and pitfalls, documented in the code -- src/helpers/test-recorder.js

There are a few hooks available in test/helpers.js --

- `startApp` -- starts Spectron
- `startAppAndConnect` -- starts spectron and waits until the socket is connected
- `startAppAndLogin` -- the above, plus logs in (with a passphrase for CI reasons)
- `login` -- login minus starting the app and connecting
- `closeApp` -- cleans up, use as `afterEach` hook

### CI

Tests run on circleCI. However, the CI is very slow, so we hack the `login` function to wipe the passcode (if it exists).

On the CI, tests on the branch `staging` are configured to run with the staging server.

### Local tests / VSCode debugger

To run and debug indvidual test files locally, make sure to compile sources first... and to set environment variables `PEERIO_DESKTOP_STAGING_TEST_USERNAME`, `PEERIO_DESKTOP_STAGING_TEST_PASSPHRASE`, `PEERIO_DESKTOP_PROD_TEST_USERNAME`, `PEERIO_DESKTOP_PROD_TEST_PASSPHRASE` in order to skip needing to create an account that will run the tests.

To configure VSCode to run each individual test in the debugger, add the following configuration:

```json
{
    "type": "node",
    "request": "launch",
    "name": "Spectron",
    "console": "integratedTerminal",
    "cwd":"${workspaceRoot}",
    "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",
    "args": [
        "${relativeFile}",
        "--require=${workspaceRoot}/test/global-setup.js",
        "--colors",
        "--reporter=nyan"
    ]
}
```

