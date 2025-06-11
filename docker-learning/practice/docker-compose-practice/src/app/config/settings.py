import os
from pathlib import Path
from typing import Dict, Any

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Environment
ENV = os.getenv("FLASK_ENV", "development")
DEBUG = ENV == "development"

# Flask settings
FLASK_APP = os.getenv("FLASK_APP", "app:create_app")
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"

# Application settings
APP_PORT = int(os.getenv("APP_PORT", "5000"))
APP_HOST = os.getenv("APP_HOST", "0.0.0.0")

# Redis settings
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_CACHE_URL = os.getenv("REDIS_CACHE_URL", f"redis://{REDIS_HOST}:{REDIS_PORT}/0")

# Database settings
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///app.db")

# Security settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key-here")

# Logging settings
LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG" if DEBUG else "INFO")
LOG_FORMAT = os.getenv(
    "LOG_FORMAT", "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Monitoring settings
SENTRY_DSN = os.getenv("SENTRY_DSN")
PROMETHEUS_METRICS_PATH = os.getenv("PROMETHEUS_METRICS_PATH", "/metrics")

# Cache settings
CACHE_TYPE = os.getenv("CACHE_TYPE", "redis")
CACHE_REDIS_URL = os.getenv("CACHE_REDIS_URL", REDIS_CACHE_URL)
CACHE_DEFAULT_TIMEOUT = int(os.getenv("CACHE_DEFAULT_TIMEOUT", "300"))

# Rate limiting settings
RATELIMIT_STORAGE_URL = os.getenv("RATELIMIT_STORAGE_URL", REDIS_CACHE_URL)
RATELIMIT_STRATEGY = os.getenv("RATELIMIT_STRATEGY", "fixed-window")
RATELIMIT_DEFAULT = os.getenv("RATELIMIT_DEFAULT", "200/hour")

# Gunicorn settings (for production)
GUNICORN_WORKERS = int(os.getenv("GUNICORN_WORKERS", "4"))
GUNICORN_THREADS = int(os.getenv("GUNICORN_THREADS", "2"))
GUNICORN_TIMEOUT = int(os.getenv("GUNICORN_TIMEOUT", "30"))


def get_settings() -> Dict[str, Any]:
    """Get all settings as a dictionary."""
    return {
        key: value
        for key, value in globals().items()
        if not key.startswith("_") and key.isupper()
    }
