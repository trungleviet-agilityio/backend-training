# Docker: Getting Started

## What is Docker?
Docker is an open platform for developing, shipping, and running applications. Docker enables you to separate your applications from your infrastructure so you can deliver software quickly. With Docker, you can manage your infrastructure in the same ways you manage your applications.

## Key Concepts

### 1. Images
- Read-only templates with instructions for creating Docker containers
- Built in layers, with each layer representing an instruction in the Dockerfile
- Can be based on other images (e.g., `python:3.11-slim` based on `debian:bullseye-slim`)
- Stored in registries (like Docker Hub)
- Example:
  ```dockerfile
  FROM python:3.11-slim
  WORKDIR /app
  COPY . .
  RUN pip install -r requirements.txt
  CMD ["python", "app.py"]
  ```

### 2. Containers
- Runnable instances of images
- Isolated environments with their own:
  - Filesystem
  - Network
  - Process space
  - Resource limits
- Share the host OS kernel
- Ephemeral by default (changes are lost when container is removed)
- Can be connected to networks and storage volumes

### 3. Registries
- Repositories for Docker images
- Docker Hub is the default public registry
- Can run private registries
- Images are pulled from registries when needed
- Images can be pushed to registries for sharing

## Docker Architecture

### 1. Docker Engine
- Client-server application with three main components:
  - Docker daemon (`dockerd`): Manages Docker objects
  - Docker client (`docker`): Command-line interface
  - REST API: Interface for Docker daemon

### 2. Docker Objects
- Images: Templates for containers
- Containers: Running instances of images
- Networks: Communication between containers
- Volumes: Persistent data storage
- Plugins: Extend Docker functionality

## Installation

### Option 1: Docker Engine (Command Line Only)
This is the traditional Docker installation that provides the Docker Engine and CLI tools.

#### Prerequisites
- 64-bit version of Ubuntu
- At least 2GB of RAM

#### Installation Steps
```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index
sudo apt-get update

# Install Docker Engine
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker daemon
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker

# Add your user to the docker group to run Docker without sudo
sudo usermod -aG docker $USER

# Apply the new group membership
# Note: You need to log out and back in for this to take effect
# Or you can run this command to apply it to the current session:
newgrp docker
```

### Option 2: Docker Desktop (GUI + Additional Features)
Docker Desktop provides a graphical interface and additional features like Kubernetes integration.

#### Prerequisites
- 64-bit version of Ubuntu 22.04, 24.04, or the latest non-LTS version
- KVM virtualization support enabled in BIOS
- At least 4GB of RAM
- If not using GNOME, install `gnome-terminal`:
  ```bash
  sudo apt install gnome-terminal
  ```

#### Installation Steps
1. **Set up Docker's package repository** (if not already done in Option 1):
   ```bash
   # Update package index
   sudo apt-get update

   # Install prerequisites
   sudo apt-get install \
       ca-certificates \
       curl \
       gnupg \
       lsb-release

   # Add Docker's official GPG key
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg

   # Add the repository to Apt sources
   echo \
     "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

2. **Download and Install Docker Desktop**:
   ```bash
   # Download the latest DEB package
   curl -O https://desktop.docker.com/linux/main/amd64/docker-desktop-amd64.deb

   # Install the package
   sudo apt-get update
   sudo apt-get install ./docker-desktop-amd64.deb
   ```

   Note: You can ignore the error message about unsandboxed download if it appears.

3. **Launch Docker Desktop**:
   - Navigate to Docker Desktop in your Desktop environment
   - Select Docker Desktop to start
   - Accept the Docker Subscription Service Agreement
   
   Or via terminal:
   ```bash
   systemctl --user start docker-desktop
   ```

4. **Enable Docker Desktop to start on login**:
   - Through GUI: Settings > General > Start Docker Desktop when you sign in
   - Or via terminal:
   ```bash
   systemctl --user enable docker-desktop
   ```

#### Verify Installation
```bash
# Check Docker Compose version
docker compose version

# Check Docker version
docker --version

# Check detailed version information
docker version
```

#### Docker Desktop Features
- **GUI Interface**: Access Docker Desktop through the Applications menu
- **Container Management**: Manage containers, images, and volumes through the GUI
- **Kubernetes Integration**: Built-in Kubernetes support
- **Resource Management**: Configure CPU, memory, and disk usage
- **Extensions**: Install additional features through the Extensions marketplace

#### Troubleshooting
1. **Startup Issues**:
   ```bash
   # Check Docker Desktop status
   systemctl --user status docker-desktop

   # View logs
   journalctl --user -u docker-desktop
   ```

2. **Permission Issues**:
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Reset Docker Desktop**:
   ```bash
   # Reset to factory defaults
   rm -rf ~/.docker/desktop
   systemctl --user restart docker-desktop
   ```

#### Upgrade Docker Desktop
When a new version is available:
1. Download the new DEB package
2. Install it using:
   ```bash
   sudo apt-get install ./docker-desktop-amd64.deb
   ```

#### Uninstall Docker Desktop
```bash
# Remove Docker Desktop
sudo apt-get remove docker-desktop

# Remove Docker Desktop data
rm -rf ~/.docker/desktop
sudo rm -rf /usr/local/bin/com.docker.cli
sudo apt-get purge docker-desktop
```

### Verify Installation
```bash
# Check Docker version
docker --version

# Verify Docker is running
# For Docker Engine:
sudo systemctl status docker

# For Docker Desktop:
systemctl --user status docker-desktop

# Run hello-world container
docker run hello-world
```

### Troubleshooting
If you see the error "Cannot connect to the Docker daemon":

1. **For Docker Engine**:
   ```bash
   # Check if Docker daemon is running
   sudo systemctl status docker
   
   # If not running, start it
   sudo systemctl start docker
   ```

2. **For Docker Desktop**:
   ```bash
   # Check Docker Desktop status
   systemctl --user status docker-desktop
   
   # Start Docker Desktop
   systemctl --user start docker-desktop
   
   # View logs
   journalctl --user -u docker-desktop
   ```

3. **Permission Issues** (for both):
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER
   newgrp docker
   ```

4. **Reset Docker Desktop** (if needed):
   ```bash
   # Reset to factory defaults
   rm -rf ~/.docker/desktop
   systemctl --user restart docker-desktop
   ```

### Uninstall
1. **Docker Engine**:
   ```bash
   sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   sudo rm -rf /var/lib/docker
   sudo rm -rf /var/lib/containerd
   ```

2. **Docker Desktop**:
   ```bash
   sudo apt-get remove docker-desktop
   rm -rf ~/.docker/desktop
   sudo rm -rf /usr/local/bin/com.docker.cli
   sudo apt-get purge docker-desktop
   ```

## Basic Commands

### 1. Working with Images
```bash
# List images
docker images

# Pull an image
docker pull python:3.11-slim

# Remove an image
docker rmi python:3.11-slim

# Build an image
docker build -t myapp:1.0 .
```

### 2. Working with Containers
```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Run a container
docker run -d -p 8080:80 nginx

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# View container logs
docker logs <container_id>
```

### 3. Working with Registries
```bash
# Login to Docker Hub
docker login

# Push an image
docker push myapp:1.0

# Pull an image
docker pull myapp:1.0
```

## Best Practices

### 1. Image Building
- Use official base images
- Minimize layers
- Use .dockerignore
- Implement multi-stage builds
- Use specific version tags
- Keep images small
- Use appropriate base images

### 2. Container Management
- Use meaningful names
- Implement health checks
- Set resource limits
- Use volumes for persistence
- Follow security guidelines
- Use container orchestration for production

## Next Steps
1. Learn about Docker networking
2. Understand Docker volumes
3. Explore Docker Compose
4. Study container orchestration 