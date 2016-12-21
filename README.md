# peerio-desktop

## Development setup

Assuming you have nodejs and npm installed.

- Clone repository
- set the environment variable `PEERIO_STAGING_SOCKET_SERVER` if you want to connect to a different server.
- `npm install` -- if it fails maybe run `npm install` in app/ first
- `npm start`

## Project structure 

```
/
- dist-assets: @TODO see below
- app: 
    - src: application files unbundled but compiled with babel
    - node_modules: application modules
    - package.json: application dependencies
- src: react sources
- dist: compiled, with node_modules (production deps) and the build folder
```
