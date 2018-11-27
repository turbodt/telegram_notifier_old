#!/bin/bash
home_path=$1
repo_path=$2
documentation_path=$3
cd $home_path
cd $repo_path
git pull bb dev
cd $home_path
# docker run --rm -v "$home_path":/app seymourlabs/apidocjs apidoc -i "$repo_path" -o "$documentation_path"
apidoc -i "$repo_path" -o "$documentation_path"