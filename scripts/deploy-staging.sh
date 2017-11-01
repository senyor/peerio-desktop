#!/usr/bin/env bash

if [ -z "$1" ]; then
    echo "*** Please specify branch name to release staging build from it."
    exit 1
fi

read -p "Confirm releasing STAGING build from $1 branch? (y/n)" choice
case "$choice" in
  y|Y ) echo "yes";;
  n|N ) exit;;
  * ) exit;;
esac

# Check if there are uncommited changes
if ! git diff-index --quiet HEAD --; then
    git status
    echo "*** There are uncommited changes, please commit or stash them"
    exit 1
fi
# this is important for locales, we need to pull latest en.json
npm install

echo "[•              ] getting locales"
./scripts/get-locales.js
if git diff-index HEAD --; then
    echo "*** Locales changed, committing."
    git commit -a -m "chore: update locales"
fi

echo "[•••            ] setting flags"
set -e
export NODE_ENV=production

echo "[••••••••       ] updating version number"
./node_modules/.bin/standard-version
git tag -d `git describe --tags` # Remove latest tag created by standard-version
git push && git push --follow-tags origin master

echo "[•••••••••••••••] building and publishing"
peerio-desktop-release --key ~/.peerio-updater/secret.key \
                       --shared ~/Win \
                       --repository PeerioTechnologies/peerio-desktop \
                       --overrides PeerioTechnologies/peerio-desktop-staging \
                       --publish \
                       --tag $1 \
                       --prerelease
