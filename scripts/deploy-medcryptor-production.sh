#!/usr/bin/env bash


read -p "Confirm releasing MEDCRYPTOR PRODUCTION build? (y/n)" choice
case "$choice" in
  y|Y ) echo "yes";;
  n|N ) exit;;
  * ) exit;;
esac

# TODO(dchest): remove --tag medcryptor-base one we're ready to build from master.

peerio-desktop-release --key ~/.peerio-updater/secret.key \
                       --shared ~/Win \
                       --repository PeerioTechnologies/peerio-desktop \
                       --overrides PeerioTechnologies/medcryptor-desktop \
                       --tag medcryptor-base \
                       --publish
