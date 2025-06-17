"""
Test settings for running tests.
"""

import os

from core.settings.base import *  # noqa: E402,F403

SECRET_KEY = "django-insecure-test-secret-key"
ALLOWED_HOSTS = ["127.0.0.1", "localhost", "103.249.201.227"]
DEBUG = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB", "test_db"),
        "USER": os.environ.get("POSTGRES_USER", "postgres"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "postgres"),
        "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = []

INSTALLED_APPS.remove("debug_toolbar")
MIDDLEWARE.remove("debug_toolbar.middleware.DebugToolbarMiddleware")

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]
LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "handlers": {
        "null": {
            "class": "logging.NullHandler",
        },
    },
    "root": {
        "handlers": ["null"],
        "level": "CRITICAL",
    },
}
