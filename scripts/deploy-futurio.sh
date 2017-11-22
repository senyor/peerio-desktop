#!/usr/bin/env bash

# this is important for locales, we need to pull latest en.json
npm install

#echo "[•              ] getting locales"
#./scripts/get-locales.sh
#if git diff-index HEAD --; then
#    echo "*** Locales changed, committing."
#    git commit -a -m "chore: update locales"
#fi

echo "[•••            ] setting flags"
set -e
export NODE_ENV=production

echo "[••••••••       ] updating version number"
./node_modules/.bin/standard-version
git tag -d `git describe --tags` # Remove latest tag created by standard-version
git push && git push --follow-tags origin dev

echo "[•••••••••••••••] building and publishing"
./node_modules/.bin/peerio-desktop-release --repository PeerioTechnologies/peerio-desktop \
                       --overrides PeerioTechnologies/peerio-desktop-futurio \
                       --publish \
                       --tag dev \
                       --nosign \
                       --key ../peerio-desktop-futurio/signing.key
