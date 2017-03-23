#!/usr/bin/env bash

echo "[•••            ] setting flags"
set -e
export NODE_ENV=production
echo "[••••••         ] cleaning up"
rm -rf dist
echo "[•••••••••      ] compiling sources"
npm run compile
echo "[••••••••••••   ] creating github release"
./node_modules/.bin/standard-version
git push --follow-tags origin master
echo "[•••••••••••••••] building bundles"
build --mac --windows --linux  --ia32 --x64 --publish always
