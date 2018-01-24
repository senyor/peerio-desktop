#!/bin/sh

set -e

BASE_DIR=$(dirname "$0")

# Mac
iconutil --convert icns --output $BASE_DIR/../dist-assets/icon.icns $BASE_DIR/icon.iconset
iconutil --convert icns --output $BASE_DIR/../dist-assets/dmg-icon.icns $BASE_DIR/dmg-icon.iconset

# Windows
convert \
    $BASE_DIR/win-icon/icon_256x256.png \
    $BASE_DIR/win-icon/icon_64x64.png \
    $BASE_DIR/win-icon/icon_48x48.png \
    $BASE_DIR/win-icon/icon_32x32.png \
    $BASE_DIR/win-icon/icon_16x16.png \
    $BASE_DIR/../dist-assets/icon.ico

convert \
    $BASE_DIR/win-installer/icon_256x256.png \
    $BASE_DIR/win-installer/icon_64x64.png \
    $BASE_DIR/win-installer/icon_48x48.png \
    $BASE_DIR/win-installer/icon_32x32.png \
    $BASE_DIR/win-installer/icon_16x16.png \
    $BASE_DIR/../dist-assets/win-installer.ico

# Linux window icon
cp $BASE_DIR/icon.iconset/icon_512x512@2x.png $BASE_DIR/../src/static/img/icon.png
