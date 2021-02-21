#!/usr/bin/env bash
version=$(python3 get_and_update_version.py)
mv build "buildv$version"
npm run build
ln -s $PWD/data build/static/data
