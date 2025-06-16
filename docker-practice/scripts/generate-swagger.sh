#!/bin/sh
echo 'Generating swagger documentation'

DJANGO_SETTINGS_MODULE=core.settings.local python manage.py spectacular --file repo_docs/openapi.yaml
