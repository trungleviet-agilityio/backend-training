import os
import socket
from flask import Blueprint, jsonify, current_app

main = Blueprint("main", __name__)


@main.route("/")
def index():
    try:
        visits = current_app.redis.incr("visits")
        
        # Get instance information for load balancing verification
        hostname = socket.gethostname()
        container_id = os.environ.get('HOSTNAME', hostname)[:12]  # Short container ID
        
        return jsonify({
            "message": "Welcome to Docker Compose Practice",
            "visits": visits,
            "served_by": {
                "hostname": hostname,
                "container_id": container_id,
                "instance": f"app-{container_id}"
            }
        })
    except Exception as e:
        hostname = socket.gethostname()
        container_id = os.environ.get('HOSTNAME', hostname)[:12]
        
        return jsonify({
            "message": "Welcome to Docker Compose Practice",
            "visits": "unavailable",
            "error": str(e),
            "served_by": {
                "hostname": hostname,
                "container_id": container_id,
                "instance": f"app-{container_id}"
            }
        })


@main.route("/health")
def health():
    try:
        current_app.redis.ping()
        redis_status = "connected"
    except Exception:
        redis_status = "disconnected"

    # Add instance info to health check
    hostname = socket.gethostname()
    container_id = os.environ.get('HOSTNAME', hostname)[:12]

    return jsonify({
        "status": "UP", 
        "redis": redis_status,
        "instance": {
            "hostname": hostname,
            "container_id": container_id,
            "service": f"app-{container_id}"
        }
    })


@main.route("/load-test")
def load_test():
    """Endpoint specifically for testing load balancing"""
    import time
    import random
    
    # Simulate some processing time
    processing_time = random.uniform(0.1, 0.5)
    time.sleep(processing_time)
    
    hostname = socket.gethostname()
    container_id = os.environ.get('HOSTNAME', hostname)[:12]
    
    try:
        # Get current visit count
        visits = current_app.redis.get("visits") or 0
        visits = int(visits)
        
        # Increment a counter for this specific instance
        instance_requests = current_app.redis.incr(f"requests:{container_id}")
        
        return jsonify({
            "message": "Load balancing test endpoint",
            "total_visits": visits,
            "instance_requests": instance_requests,
            "processing_time": round(processing_time, 3),
            "served_by": {
                "hostname": hostname,
                "container_id": container_id,
                "instance": f"app-{container_id}"
            },
            "timestamp": time.time()
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "served_by": {
                "hostname": hostname,
                "container_id": container_id,
                "instance": f"app-{container_id}"
            }
        })
