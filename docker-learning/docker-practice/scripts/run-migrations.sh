#!/bin/sh
echo 'Running migrations'

DJANGO_SETTINGS_MODULE=core.settings.local python manage.py migrate
