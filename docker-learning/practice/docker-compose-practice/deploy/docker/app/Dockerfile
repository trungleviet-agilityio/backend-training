# Builder stage
FROM python:3.11-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/ requirements/

ARG ENV=development
RUN if [ "$ENV" = "production" ]; then \
      pip install --no-cache-dir -r requirements/prod.txt; \
    else \
      pip install --no-cache-dir -r requirements/dev.txt; \
    fi

# Final stage
FROM python:3.11-slim AS final
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy app code
COPY . /app/

# Create entrypoint script
RUN echo '#!/bin/sh\n\
echo "Waiting for Redis..."\n\
while ! nc -z $REDIS_HOST $REDIS_PORT; do\n\
  sleep 0.1\n\
done\n\
echo "Redis is ready!"\n\
export PYTHONPATH=/app\n\
if [ "$FLASK_ENV" = "development" ]; then\n\
    echo "Starting development server..."\n\
    python main.py\n\
else\n\
    echo "Starting production server..."\n\
    gunicorn --bind 0.0.0.0:5000 --workers ${GUNICORN_WORKERS:-4} --threads ${GUNICORN_THREADS:-2} --timeout ${GUNICORN_TIMEOUT:-30} "main:app"\n\
fi' > /entrypoint.sh && chmod +x /entrypoint.sh

# Create non-root user and switch
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 5000

ENTRYPOINT ["/entrypoint.sh"]
