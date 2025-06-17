#!/bin/sh
echo 'Generating swagger documentation'

# Generate the swagger documentation
echo "Running spectacular command..."
DJANGO_SETTINGS_MODULE=core.settings.local python manage.py spectacular --file repo_docs/openapi.yaml

echo "Swagger documentation generated successfully at repo_docs/openapi.yaml"
