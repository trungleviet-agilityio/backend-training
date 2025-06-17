#!/bin/sh
echo 'Running development server'

# Ensure static files are collected
if [ ! -d "staticfiles" ]; then
    echo "Collecting static files..."
    DJANGO_SETTINGS_MODULE=core.settings.local python manage.py collectstatic --noinput
fi

DJANGO_SETTINGS_MODULE=core.settings.local python manage.py runserver
