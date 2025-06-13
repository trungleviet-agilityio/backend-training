#!/bin/sh
echo 'Running development server'
DJANGO_SETTINGS_MODULE=app.settings.local python manage.py runserver
