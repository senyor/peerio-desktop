#!/usr/bin/env bash
read -p "Confirm releasing PRODUCTION build from MASTER branch? (y/n)" choice
case "$choice" in
  y|Y ) echo "yes";;
  n|N ) exit;;
  * ) exit;;
esac

# Check if there are uncommited changes
# if ! git diff-index --quiet HEAD --; then
#     git status
#     echo "*** There are uncommited changes, please commit or stash them"
#     exit 1
# fi

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


if [[ $1 = "mandatory" ]]; then
  NEW_VERSION=$(./node_modules/.bin/standard-version --dry-run | grep 'tagging release' | sed -e 's/.*tagging release //g')
  echo "Mandatory update as version $NEW_VERSION"
  sed -i '' "s/\(\"lastMandatoryUpdateVersion\": \"\)[^\"]*\(\",\)/\1$NEW_VERSION\2/g" package.json
  git commit -a -m "chore: set lastMandatoryUpdateVersion to $NEW_VERSION"
else
  echo "Optional update"
fi


echo "[••••••••       ] tagging release"
./node_modules/.bin/standard-version
git push && git push --follow-tags origin master

echo "[•••••••••••••••] building and publishing"
echo '**'
echo '** NOTE: on Windows, run: peerio-desktop-signer --shared Y:\ --certificate "certificate subject name"'
echo '**'
./node_modules/.bin/peerio-desktop-release --key ~/Development/signify_release_private.key \
                       --shared ~/winnie \
                       --repository PeerioTechnologies/peerio-desktop \
                       --publish \
                       --platforms windows,mac
