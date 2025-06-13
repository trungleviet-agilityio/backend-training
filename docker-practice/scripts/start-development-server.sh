#!/bin/sh

echo 'Running migrations'
DJANGO_SETTINGS_MODULE=app.settings.local python manage.py migrate

echo 'Running development server'
DJANGO_SETTINGS_MODULE=app.settings.local python manage.py runserver 0.0.0.0:8000
