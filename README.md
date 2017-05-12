# Peerio Messenger (Desktop)

[![CircleCI](https://circleci.com/gh/PeerioTechnologies/peerio-desktop/tree/master.svg?style=svg)](https://circleci.com/gh/PeerioTechnologies/peerio-desktop/tree/master)

## SDK

The SDK lives in [https://github.com/PeerioTechnologies/peerio-icebear](peerio-icebear).

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

## Development

For info about development setup and contribution, see the [Development](./docs/development.md) doc.