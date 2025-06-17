import os

import redis
from flask import Flask, jsonify

app = Flask(__name__)

# Connect to Redis (host will be 'redis' when running in Docker network)
redis_host = os.environ.get("REDIS_HOST", "redis")
redis_port = int(os.environ.get("REDIS_PORT", 6379))
redis_client = redis.Redis(host=redis_host, port=redis_port, db=0)


@app.route("/")
def hello():
    # Increment visit counter in Redis
    count = redis_client.incr("counter")
    return jsonify({"message": "Hello from Docker with Redis!", "visits": count})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
