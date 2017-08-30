#!/bin/sh -e

log_() { echo "[setup-node-env] $@"; }

log_ "--> Setting up symbolic links"
cd node_modules
[ -L __ ] || ln -s ../src/lib __
[ -L server ] || ln -s ../src/server server
[ -L client ] || ln -s ../src/client client
