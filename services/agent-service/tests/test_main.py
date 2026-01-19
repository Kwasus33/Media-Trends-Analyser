from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_service_test_client():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"service": "agent"}
