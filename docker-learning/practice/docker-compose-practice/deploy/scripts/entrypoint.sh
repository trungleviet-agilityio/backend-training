#!/bin/sh

# Wait for Redis to be ready
echo "Waiting for Redis..."
while ! nc -z $REDIS_HOST $REDIS_PORT; do
  sleep 0.1
done
echo "Redis is ready!"

# Set environment variables
export FLASK_APP=app:create_app
export PYTHONPATH=/app

# Start the application based on environment
if [ "$FLASK_ENV" = "development" ]; then
    echo "Starting development server..."
    python -m flask run --host=0.0.0.0 --port=5000
else
    echo "Starting production server..."
    gunicorn \
        --bind 0.0.0.0:5000 \
        --workers ${GUNICORN_WORKERS:-4} \
        --threads ${GUNICORN_THREADS:-2} \
        --timeout ${GUNICORN_TIMEOUT:-30} \
        "app:create_app()"
fi
