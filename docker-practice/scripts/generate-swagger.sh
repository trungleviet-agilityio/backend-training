#!/bin/sh
echo 'Generating swagger documentation'

DJANGO_SETTINGS_MODULE=app.settings.local python manage.py spectacular --file repo_docs/openapi.yaml
