from flask import Blueprint, jsonify, current_app

main = Blueprint('main', __name__)

@main.route('/')
def index():
    try:
        visits = current_app.redis.incr('visits')
        return jsonify({
            'message': 'Welcome to Docker Compose Practice',
            'visits': visits
        })
    except Exception as e:
        return jsonify({
            'message': 'Welcome to Docker Compose Practice',
            'visits': 'unavailable',
            'error': str(e)
        })

@main.route('/health')
def health():
    try:
        current_app.redis.ping()
        redis_status = 'connected'
    except Exception:
        redis_status = 'disconnected'
        
    return jsonify({
        'status': 'UP',
        'redis': redis_status
    })
