#!/bin/sh -e

ME=$(basename $0)

log_() { echo "[$ME] $@"; }

PORT=`node src/server/port.js`
PID=`curl --silent http://localhost:$PORT/pid`

log_ "--> Killing PID $PID on port $PORT"
kill $PID
