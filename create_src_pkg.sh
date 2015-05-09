#!/bin/bash
if [[ -z $1 ]]; then
    echo 'Usage: ./create_src_pkg <VERSION>'
    exit
fi
mkdir canopy-web-ui-$1
cp *.js *.txt *.html canopy-device-mgr-$1
cp -r www canopy-web-ui-$1
tar -czvf canopy-web-ui_${1}.src.tar.gz canopy-web-ui-$1
rm -r canopy-web-ui-$1
