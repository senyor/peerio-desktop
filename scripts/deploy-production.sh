#!/usr/bin/env bash

echo "[•••            ] setting flags"
set -e
export NODE_ENV=production
export CSC_LINK=~/.cert/peerio_mac.p12
# EV certs use token instead of file, subject is set in electron-builder config: win/certificateSubjectName
# export WIN_CSC_LINK=~/.cert
echo "[••••••         ] cleaning up"
rm -rf dist
echo "[•••••••••      ] compiling sources"
npm run compile
echo "[••••••••••••   ] creating github release"
./node_modules/.bin/standard-version
git push --follow-tags origin master
echo "[•••••••••••••••] building bundles"
build --mac --windows --ia32 --x64 --publish always
