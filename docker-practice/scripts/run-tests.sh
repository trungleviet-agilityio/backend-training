#!/bin/sh
echo 'Running tests'

DJANGO_SETTINGS_MODULE=core.settings.test pytest
