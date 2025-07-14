# Use official PostgreSQL image
FROM postgres:15.1-alpine

# Create directory for initialization scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# Copy initialization scripts
COPY create-user.sh /docker-entrypoint-initdb.d/01-create-user.sh

# Make script executable
RUN chmod +x /docker-entrypoint-initdb.d/01-create-user.sh

EXPOSE 5432

CMD ["postgres"]
