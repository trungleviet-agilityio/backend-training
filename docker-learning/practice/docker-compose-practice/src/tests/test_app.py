import pytest
from unittest.mock import MagicMock

from app import create_app


@pytest.fixture
def app():
    app = create_app()
    app.config.update({"TESTING": True})
    # Mock Redis for all tests
    mock_redis = MagicMock()
    mock_redis.get.return_value = b"0"
    mock_redis.incr.return_value = 1
    mock_redis.ping.return_value = True
    app.redis = mock_redis
    return app


@pytest.fixture
def client(app):
    return app.test_client()


def test_visits_route(client):
    response = client.get("/visits")
    assert response.status_code == 200
    data = response.get_json()
    assert "message" in data
    assert "visits" in data
    assert "served_by" in data
    assert "hostname" in data["served_by"]
    assert "container_id" in data["served_by"]
    assert "instance" in data["served_by"]


def test_health_route(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.get_json()
    assert "status" in data
    assert "redis" in data
    assert "instance" in data
    assert "hostname" in data["instance"]
    assert "container_id" in data["instance"]
    assert "service" in data["instance"]


def test_load_test_route_success(client):
    response = client.get("/load-test")
    assert response.status_code == 200
    data = response.get_json()
    assert "message" in data
    assert "total_visits" in data
    assert "instance_requests" in data
    assert "processing_time" in data
    assert "served_by" in data
    assert "timestamp" in data
