#!/usr/bin/env bash
BRANCH=`git branch | grep \* | cut -d ' ' -f2`;
if [ "$BRANCH" == "staging" ]; then
    echo "Running on staging branch: using $STAGING_URL for tests";
    echo "export PEERIO_STAGING_SOCKET_SERVER='$STAGING_URL';" >> ~/.circlerc;
else
    echo "Running on $BRANCH: Using production for tests";
fi