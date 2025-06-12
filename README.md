# backend-training

# Docker Compose Practice

A Flask application demonstrating Docker Compose usage with Redis integration.

## Features

- Flask web application
- Redis for caching and data storage
- Multi-stage Docker builds
- Development and production configurations
- Comprehensive testing with GitHub Actions
- Automated Docker Hub deployments

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **Lint**: Code quality checks with ruff
- **Test**: Unit tests with pytest and coverage
- **Build & Push**: Docker images to Docker Hub
- **Deploy**: Production deployment automation

**Note**: Ensure Docker Hub credentials are properly configured in GitHub repository secrets:
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token (not password)