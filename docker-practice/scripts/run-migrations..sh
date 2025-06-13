#!/bin/sh
echo 'Running migrations'

DJANGO_SETTINGS_MODULE=app.settings.local python manage.py migrate
