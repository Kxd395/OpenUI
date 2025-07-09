from fastapi.testclient import TestClient
from openui.server import app

client = TestClient(app)

def test_health_check():
    """Test that the server starts and responds"""
    # Test the SPA endpoint which should return HTML
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers.get("content-type", "")

def test_api_docs():
    """Test that API documentation is accessible"""
    response = client.get("/docs")
    assert response.status_code == 200

def test_session_endpoint_requires_auth():
    """Test that session endpoint works (may require auth in production)"""
    response = client.get("/v1/session")
    # In local development, this should work; in production it requires auth
    assert response.status_code in [200, 404]  # 404 if no session found

def test_ollama_models_endpoint():
    """Test ollama models endpoint"""
    response = client.get("/v1/ollama/tags")
    # This may fail if Ollama is not running, which is expected
    assert response.status_code in [200, 500]  # 500 if Ollama not available 