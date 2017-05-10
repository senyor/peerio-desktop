#!/usr/bin/env bash
echo "[•••            ] setting flags"
set -e
export NODE_ENV=production

echo "[••••••••       ] tagging release"
./node_modules/.bin/standard-version
git push && git push --follow-tags origin master

echo "[•••••••••••••••] building and publishing"
echo '**'
echo '** NOTE: on Windows, run: peerio-desktop-signer --shared Y:\ --certificate "certificate subject name"'
echo '**'
peerio-desktop-release --shared ~/Win \
                       --repository PeerioTechnologies/peerio-desktop \
                       --publish
