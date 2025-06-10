# Docker Practice Project

This project is designed to help you learn Docker concepts step by step, from basic container operations to networking and volumes.

## Project Structure
```
docker-flask-practice/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── Dockerfile         # Docker configuration
└── README.md          # This file
```

## Practice Sections

### 1. Basic Docker Practice
Learn fundamental Docker concepts and commands with a simple Flask application.

#### How to Run
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

#### What You'll Learn
- Dockerfile basics
- Building Docker images
- Running containers
- Container lifecycle management
- Port mapping
- Container logs
- Basic Docker commands

---

### 2. Networking Practice
Learn about Docker networking by connecting multiple containers.

#### How to Run
1. **Build the Flask image:**
   ```bash
   docker build -t hello-redis .
   ```

2. **Create a custom network:**
   ```bash
   docker network create app-network
   ```

3. **Run a Redis container on the network:**
   ```bash
   docker run -d --name redis --network app-network redis:7-alpine
   ```

4. **Run the Flask app container on the same network:**
   ```bash
   docker run -d --name hello-redis-app --network app-network -p 5000:5000 hello-redis
   ```

5. **Test the application:**
   ```bash
   curl http://localhost:5000
   ```
   Or open http://localhost:5000 in your browser. Each refresh increments the visit counter stored in Redis.

6. **View running containers:**
   ```bash
   docker ps
   ```

7. **View logs:**
   ```bash
   docker logs hello-redis-app
   docker logs redis
   ```

8. **Inspect the network:**
   ```bash
   docker network inspect app-network
   ```
   This will show you:
   - Network configuration
   - Connected containers
   - IP addresses
   - Network settings

9. **Stop and remove containers:**
   ```bash
   docker stop hello-redis-app redis
   docker rm hello-redis-app redis
   ```

10. **Remove the network:**
    ```bash
    docker network rm app-network
    ```

#### Troubleshooting and Experimentation
1. **Test Container Communication:**
   ```bash
   # Stop Redis and see what happens
   docker stop redis
   curl http://localhost:5000  # Should show an error
   
   # Start Redis again
   docker start redis
   curl http://localhost:5000  # Should work again
   ```

2. **Network Isolation Test:**
   ```bash
   # Try running Flask without network
   docker run -d --name test-app -p 5001:5000 hello-redis
   curl http://localhost:5001  # Should fail to connect to Redis
   ```

3. **Network Removal Test:**
   ```bash
   # Try removing network while containers are running
   docker network rm app-network  # Should fail
   
   # Remove network after stopping containers
   docker stop hello-redis-app redis
   docker network rm app-network  # Should succeed
   ```

4. **Container Name Resolution:**
   ```bash
   # Check if containers can resolve each other
   docker exec hello-redis-app ping redis  # Should work
   ```

#### What You'll Learn
- Creating Docker networks
- Running multi-container apps
- Container-to-container communication by name
- Network inspection and management
- Service discovery
- Network isolation
- Troubleshooting network issues

---

### 3. Volumes Practice (Coming Soon)
Learn about Docker volumes and data persistence.

#### What You'll Learn
- Creating and managing volumes
- Data persistence
- Volume inspection
- Backup and restore
- Volume security 