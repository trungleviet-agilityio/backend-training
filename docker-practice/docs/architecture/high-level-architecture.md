# High Level Architecture Documentation

## System Overview

```mermaid
graph TB
    subgraph "Development"
        CODE[Python DRF Code]
        GITHUB[GitHub Repository]
    end

    subgraph "CI/CD Pipeline"
        ACTIONS[GitHub Actions]
        TEST[Run Tests]
        BUILD[Build Docker Image]
        PUSH[Push to Docker Hub]
    end

    subgraph "VPS Deployment"
        DOCKER[Docker Container]
        POSTGRES[PostgreSQL]
    end

    CODE --> GITHUB
    GITHUB --> ACTIONS
    ACTIONS --> TEST
    TEST --> BUILD
    BUILD --> PUSH
    PUSH --> DOCKER
    DOCKER --> POSTGRES
```

## Architecture Components

### 1. Development Environment
- **Python DRF Application**
  - Django REST Framework (DRF)
  - PostgreSQL database
  - Docker containerization

- **GitHub Repository**
  - Source code management
  - Version control
  - Branch protection rules (main and develop)
  - Automated cleanup of merged branches

### 2. CI/CD Pipeline (GitHub Actions)

#### Workflow Steps
1. **Test & Quality**
   - Lint code (Ruff, Black)
   - Run unit tests (pytest)
   - Code coverage reporting
   - PostgreSQL service for tests

2. **Build**
   - Build Docker image
   - Tag images (latest + commit SHA)
   - Multi-stage builds for optimization

3. **Deploy**
   - Push to Docker Hub
   - SSH deployment to VPS
   - Container management
   - Health checks

### 3. VPS Infrastructure

#### Docker Container
- **Container Management**
  - Single container deployment
  - Volume mounting for persistence
  - Port mapping (8000:8000)
  - Automatic restart policy

#### PostgreSQL Database
- **Database**
  - Local PostgreSQL instance
  - Volume-mounted data
  - Regular backups (recommended)

## Deployment Architecture

```mermaid
graph TB
    subgraph "GitHub Actions Workflows"
        DEVELOP[develop-ci.yaml]
        PROD[production-ci-cd.yaml]
        ROLLBACK[roll-back-manual.yaml]
        CLEANUP[cleanup.yaml]
    end

    subgraph "Shared Components"
        SHARED[shared-ci-jobs.yml]
        LINT[Code Quality]
        TESTS[Unit Tests]
        DOCKER_TEST[Docker Tests]
    end

    subgraph "VPS Deployment"
        SSH[SSH Deploy]
        CONTAINER[Docker Container]
        HEALTH[Health Check]
    end

    DEVELOP --> SHARED
    PROD --> SHARED
    SHARED --> LINT
    SHARED --> TESTS
    SHARED --> DOCKER_TEST
    PROD --> SSH
    SSH --> CONTAINER
    CONTAINER --> HEALTH
    ROLLBACK --> SSH
```

## Security Considerations

### 1. GitHub Security
- Repository secrets for sensitive data
  - `VPS_HOST`
  - `VPS_USERNAME`
  - `VPS_SSH_KEY`
  - `DOCKER_USERNAME`
  - `DOCKER_PASSWORD`
- Branch protection rules
- Required PR reviews

### 2. Docker Security
- Multi-stage builds
- Base image security
- Container best practices
- Image pruning after deployment

### 3. VPS Security
- SSH key authentication
- Firewall configuration
- Regular system updates
- Limited port exposure

## Monitoring

### 1. Application Monitoring
- Container health checks
- Application logs
- Error tracking
- HTTP endpoint monitoring

### 2. Infrastructure Monitoring
- Docker container status
- PostgreSQL performance
- Disk usage monitoring
- Network monitoring

## Cost Optimization

### 1. VPS Resources
- Right-sized VPS instance
- Optimized container resources
- Storage management

### 2. Docker Optimization
- Multi-stage builds
- Image size optimization
- Layer caching
- Regular cleanup of unused images
