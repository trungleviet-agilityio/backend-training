#!/bin/sh

echo 'Starting DB and server'
sh scripts/run-db.sh &

sh scripts/run-server.sh &
