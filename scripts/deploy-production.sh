#!/usr/bin/env bash

echo "[••          ] setting flags"
set -e
export NODE_ENV=production
echo "[••••        ] cleaning up"
rm -rf dist
echo "[••••••      ] compiling sources"
npm run compile
echo "[••••••••    ] creating github release"
./node_modules/.bin/peerio-desktop-standard-version
git push --follow-tags origin master
echo "[••••••••••  ] building 32-bit bundles"
build --windows --linux --ia32 --publish always
echo "[••••••••••••] building 64-bit bundles"
build --mac --windows --linux --x64 --publish always
