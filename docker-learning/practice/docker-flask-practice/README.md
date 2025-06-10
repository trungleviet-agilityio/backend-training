# Docker Flask Practice

A simple Flask application containerized with Docker to help you learn Docker basics. This project demonstrates how to containerize a Python web application and manage it using Docker commands.

## Project Structure
```
docker-flask-practice/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
└── README.md          # This file
```

## How to Run

1. Build the Docker image:
   ```bash
   docker build -t hello-world .
   ```

2. Run the container:
   ```bash
   docker run -d -p 5000:5000 --name hello-world-app hello-world
   ```
   Note: 
   - `-d` runs the container in detached mode (background)
   - `--name` gives the container a name for easy reference
   - `-p 5000:5000` maps port 5000 from the container to your host machine

3. Test the application:
   ```bash
   curl http://localhost:5000
   ```
   Or open http://localhost:5000 in your browser

4. View running containers:
   ```bash
   docker ps
   ```

5. View container logs:
   ```bash
   docker logs hello-world-app
   ```

6. Stop the container:
   ```bash
   docker stop hello-world-app
   ```

7. Remove the container:
   ```bash
   docker rm hello-world-app
   ```

## What You'll Learn

1. **Dockerfile Basics**:
   - Base image selection
   - Working directory setup
   - File copying
   - Dependency installation
   - Port exposure
   - Command execution

2. **Docker Commands**:
   - `docker build`: Building images
   - `docker run`: Running containers
   - `docker ps`: Listing containers
   - `docker logs`: Viewing container logs
   - `docker stop`: Stopping containers
   - `docker rm`: Removing containers

3. **Container Concepts**:
   - Port mapping
   - Container isolation
   - Image layers
   - Container lifecycle
   - Detached mode
   - Container naming 