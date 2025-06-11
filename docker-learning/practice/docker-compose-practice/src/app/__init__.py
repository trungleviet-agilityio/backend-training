from flask import Flask
import redis
import os


def create_app():
    app = Flask(__name__)

    # Configure Redis
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = int(os.getenv("REDIS_PORT", 6379))
    app.redis = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

    # Register routes
    from .routes import main

    app.register_blueprint(main)

    return app
