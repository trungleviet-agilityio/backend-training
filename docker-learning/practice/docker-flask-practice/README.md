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

### 3. Volumes Practice
Learn about Docker volumes and data persistence by ensuring our Redis data survives container restarts.

#### How to Run
1. **Create a volume for Redis data:**
   ```bash
   docker volume create redis-data
   ```

2. **Stop and remove existing containers:**
   ```bash
   docker stop hello-redis-app redis
   docker rm hello-redis-app redis
   ```

3. **Run Redis with volume:**
   ```bash
   docker run -d \
     --name redis \
     --network app-network \
     -v redis-data:/data \
     redis:7-alpine \
     redis-server --appendonly yes
   ```
   Note: `--appendonly yes` enables Redis persistence

4. **Run the Flask app:**
   ```bash
   docker run -d \
     --name hello-redis-app \
     --network app-network \
     -p 5000:5000 \
     hello-redis
   ```

5. **Test the application:**
   ```bash
   # Make some visits
   curl http://localhost:5000
   curl http://localhost:5000
   curl http://localhost:5000
   ```

6. **View running containers:**
   ```bash
   docker ps
   ```

7. **View container logs:**
   ```bash
   docker logs hello-redis-app
   docker logs redis
   ```

8. **Inspect the volume:**
   ```bash
   docker volume inspect redis-data
   ```
   This will show you:
   - Volume name
   - Driver
   - Mount point
   - Creation date
   - Labels

9. **Test data persistence:**
   ```bash
   # Stop and remove containers
   docker stop hello-redis-app redis
   docker rm hello-redis-app redis

   # Start Redis with same volume
   docker run -d \
     --name redis \
     --network app-network \
     -v redis-data:/data \
     redis:7-alpine \
     redis-server --appendonly yes

   # Start Flask app
   docker run -d \
     --name hello-redis-app \
     --network app-network \
     -p 5000:5000 \
     hello-redis

   # Check if counter persists
   curl http://localhost:5000
   ```

10. **Clean up:**
    ```bash
    # Stop and remove containers
    docker stop hello-redis-app redis
    docker rm hello-redis-app redis

    # Remove volume
    docker volume rm redis-data
    ```

#### Troubleshooting and Experimentation
1. **Test Without Volume:**
   ```bash
   # Run Redis without volume
   docker run -d --name test-redis --network app-network redis:7-alpine
   docker run -d --name test-app --network app-network -p 5001:5000 hello-redis

   # Make some visits
   curl http://localhost:5001

   # Stop and restart containers
   docker stop test-redis test-app
   docker start test-redis test-app

   # Check counter (should reset)
   curl http://localhost:5001
   ```

2. **Test Volume Persistence:**
   ```bash
   # Run with volume
   docker run -d --name vol-redis --network app-network -v redis-data:/data redis:7-alpine redis-server --appendonly yes
   docker run -d --name vol-app --network app-network -p 5000:5000 hello-redis

   # Make visits
   curl http://localhost:5000

   # Stop and restart
   docker stop vol-redis vol-app
   docker start vol-redis vol-app

   # Check counter (should persist)
   curl http://localhost:5000
   ```

3. **Test Volume Cleanup:**
   ```bash
   # Try removing volume while container is running
   docker volume rm redis-data  # Should fail

   # Remove volume after stopping container
   docker stop vol-redis
   docker volume rm redis-data  # Should succeed
   ```

#### Verification
After following the steps above, you should see the visit counter continue from where you left off, even after removing and recreating the containers. For example:

1. Make several requests to the Flask app:
   ```bash
   curl http://localhost:5000
   # ...repeat a few times
   ```
   The counter should increment (e.g., 1, 2, 3, ...).

2. Stop and remove both containers:
   ```bash
   docker stop hello-redis-app redis
   docker rm hello-redis-app redis
   ```

3. Start both containers again with the same volume:
   ```bash
   docker run -d --name redis --network app-network -v redis-data:/data redis:7-alpine redis-server --appendonly yes
   docker run -d --name hello-redis-app --network app-network -p 5000:5000 hello-redis
   ```

4. Make another request:
   ```bash
   curl http://localhost:5000
   ```
   The counter should continue from the previous value (not reset to 1).

This demonstrates that Docker volumes persist data independently of the container lifecycle.

#### Summary
- Docker volumes are essential for data persistence in stateful services like databases.
- Without a volume, Redis data would be lost when the container is removed.
- With a named volume, data is safe and can be reused by new containers.
- Always use named volumes for important data.
- Experiment by running Redis without a volume to see the difference in persistence.

#### Best Practices
1. **Volume Usage:**
   - Use named volumes for persistent data
   - Use bind mounts for development
   - Use tmpfs for sensitive data
   - Implement proper permissions

2. **Data Management:**
   - Regular backups
   - Volume naming conventions
   - Proper cleanup
   - Monitor volume usage
   - Implement data retention policies

3. **Security:**
   - Use read-only mounts when possible
   - Implement proper permissions
   - Regular security audits
   - Backup sensitive data
   - Use tmpfs for temporary data
