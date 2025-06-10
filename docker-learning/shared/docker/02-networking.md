# Docker Networking

## Overview
Docker networking enables containers to communicate with each other and with the outside world. It provides isolation, security, and flexibility for containerized applications. Docker's networking subsystem is pluggable, using drivers that provide different types of networks.

## Network Drivers

### 1. Bridge Network (Default)
- Most common network type
- Used for standalone containers
- Provides internal DNS resolution
- Isolates containers from host network
- Example:
  ```bash
  # Create a bridge network
  docker network create my-bridge-network

  # Run containers on the network
  docker run -d --network my-bridge-network --name web nginx
  docker run -d --network my-bridge-network --name db postgres
  ```

### 2. Host Network
- Removes network isolation between container and host
- Container uses host's network directly
- Best performance but least isolation
- Useful for high-performance applications
- Example:
  ```bash
  # Run container with host network
  docker run -d --network host nginx
  ```

### 3. Overlay Network
- Used in Docker Swarm mode
- Enables communication between containers across multiple hosts
- Supports encryption and service discovery
- Example:
  ```bash
  # Create overlay network
  docker network create -d overlay my-overlay-network

  # Run service on overlay network
  docker service create --network my-overlay-network --name web nginx
  ```

### 4. Macvlan Network
- Allows containers to appear as physical devices
- Assigns MAC addresses to containers
- Useful for legacy applications
- Example:
  ```bash
  # Create macvlan network
  docker network create -d macvlan \
    --subnet=192.168.1.0/24 \
    --gateway=192.168.1.1 \
    -o parent=eth0 my-macvlan-network
  ```

### 5. None Network
- Completely isolates container from network
- No network access
- Useful for security-sensitive applications
- Example:
  ```bash
  # Run container with no network
  docker run -d --network none nginx
  ```

## Common Networking Tasks

### 1. Network Management
```bash
# List networks
docker network ls

# Inspect network
docker network inspect my-bridge-network

# Remove network
docker network rm my-bridge-network

# Prune unused networks
docker network prune
```

### 2. Container Networking
```bash
# Connect container to network
docker network connect my-bridge-network container_name

# Disconnect container from network
docker network disconnect my-bridge-network container_name

# Run container with multiple networks
docker run -d \
  --network my-bridge-network \
  --network my-overlay-network \
  --name multi-net nginx
```

## Port Mapping

### 1. Basic Port Mapping
```bash
# Map container port to host port
docker run -d -p 8080:80 nginx

# Map to specific host interface
docker run -d -p 127.0.0.1:8080:80 nginx

# Map multiple ports
docker run -d -p 8080:80 -p 8443:443 nginx
```

### 2. Port Range Mapping
```bash
# Map range of ports
docker run -d -p 8080-8090:80 nginx

# Map UDP ports
docker run -d -p 8080:80/udp nginx
```

## DNS and Service Discovery

### 1. Container DNS
- Containers can resolve each other by name
- Automatic DNS resolution within networks
- Example:
  ```bash
  # Create network
  docker network create my-network

  # Run containers
  docker run -d --network my-network --name web nginx
  docker run -d --network my-network --name db postgres

  # web container can resolve 'db' hostname
  docker exec web ping db
  ```

### 2. Custom DNS
```bash
# Run container with custom DNS
docker run -d --dns 8.8.8.8 nginx

# Run container with DNS search domains
docker run -d --dns-search example.com nginx
```

## Network Security

### 1. Network Isolation
- Use bridge networks for isolation
- Implement network policies
- Limit container capabilities
- Use encrypted overlay networks

### 2. Access Control
```bash
# Run container with limited network access
docker run -d --network my-bridge-network --cap-drop=NET_RAW nginx

# Run container with read-only network
docker run -d --network my-bridge-network --read-only nginx
```

## Common Use Cases

### 1. Web Application Stack
```bash
# Create network
docker network create web-stack

# Run containers
docker run -d --network web-stack --name nginx nginx
docker run -d --network web-stack --name app python:3.11
docker run -d --network web-stack --name db postgres
```

### 2. Microservices Architecture
```bash
# Create networks
docker network create frontend
docker network create backend

# Run services
docker run -d --network frontend --name web nginx
docker run -d --network frontend --network backend --name api python:3.11
docker run -d --network backend --name db postgres
```

## Troubleshooting

### 1. Common Issues
- Container connectivity problems
- Port conflicts
- DNS resolution issues
- Network performance

### 2. Debugging Commands
```bash
# Check container network settings
docker inspect container_name

# Test network connectivity
docker exec container_name ping other_container

# View network logs
docker logs container_name

# Check network statistics
docker stats container_name
```

## Best Practices

### 1. Network Design
- Use appropriate network drivers
- Implement proper isolation
- Plan for scalability
- Consider security requirements

### 2. Performance
- Use host network for performance-critical applications
- Implement proper port mapping
- Monitor network usage
- Use appropriate network drivers

## Next Steps
1. Learn about Docker Swarm networking
2. Explore network security features
3. Study container orchestration networking
4. Practice with complex network topologies 