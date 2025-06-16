#!/bin/sh
echo 'Running shell'

DJANGO_SETTINGS_MODULE=core.settings.local python manage.py shell
