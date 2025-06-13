#!/bin/sh
echo 'Generating migrations'

DJANGO_SETTINGS_MODULE=app.settings.local python manage.py makemigrations
