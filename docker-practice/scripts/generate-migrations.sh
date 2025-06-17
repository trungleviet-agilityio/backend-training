#!/bin/sh
echo 'Generating migrations'

DJANGO_SETTINGS_MODULE=core.settings.local python manage.py makemigrations
