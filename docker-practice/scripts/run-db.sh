#!/bin/sh
echo 'Starting the database'

docker-compose up -d postgres  #  This will start the database in the background, leaving the terminal open
