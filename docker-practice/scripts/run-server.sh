#!/bin/sh
echo 'Running development server'
DJANGO_SETTINGS_MODULE=core.settings.local python manage.py runserver
