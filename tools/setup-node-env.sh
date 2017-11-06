#!/bin/sh -e

ME=$(basename $0)

log_() { echo "[$ME] $@"; }

log_ "--> Setting up symbolic links"
cd node_modules
[ -L __ ] || ln -s ../src/lib __
[ -L server ] || ln -s ../src/server server
[ -L client ] || ln -s ../src/client client
[ -L fixtures ] || ln -s ../src/fixtures fixtures
