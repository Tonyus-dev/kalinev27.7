#!/bin/bash
set -e

APP_NAME="hestia-console"
VERSION="1.0.0"
ARCH="all"
BUILD_DIR="build_deb/${APP_NAME}_${VERSION}_${ARCH}"

# Prepare structure
mkdir -p "$BUILD_DIR/DEBIAN"
mkdir -p "$BUILD_DIR/opt/$APP_NAME"
mkdir -p "$BUILD_DIR/etc/systemd/system"
mkdir -p "$BUILD_DIR/usr/bin"
mkdir -p "$BUILD_DIR/usr/share/applications"
mkdir -p "$BUILD_DIR/usr/share/icons/hicolor/scalable/apps"

# Copy files
cp package.json hestia.js "$BUILD_DIR/opt/$APP_NAME/"
cp packaging/hestia-console.service "$BUILD_DIR/etc/systemd/system/"
cp packaging/bin/* "$BUILD_DIR/usr/bin/"
cp packaging/hestia-console.desktop "$BUILD_DIR/usr/share/applications/"
cp packaging/hestia-console.svg "$BUILD_DIR/usr/share/icons/hicolor/scalable/apps/"

# Create control file
cat << 'CTRL' > "$BUILD_DIR/DEBIAN/control"
Package: hestia-console
Version: 1.0.0
Section: utils
Priority: optional
Architecture: all
Maintainer: Kaline <kaline@localhost>
Description: Héstia Console MVP for local monitoring
CTRL

# Build deb
mkdir -p dist-deb
dpkg-deb --build "$BUILD_DIR" "dist-deb/"

echo "Build complete. .deb package is in dist-deb/"
