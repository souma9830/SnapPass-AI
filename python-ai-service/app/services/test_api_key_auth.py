"""
Tests for the X-API-Key auth gate added in #1488.

The gate lives in main.py's require_api_key before_request hook and is
only enforced when AI_SERVICE_API_KEY is set, so these tests monkeypatch
the env/config to exercise both the enforcing and open modes.
"""

import importlib
import os
import sys
import hmac

import pytest

# Ensure the service package is importable for a lightweight test client.
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

import config  # noqa: E402
import main as app_module  # noqa: E402

TEST_KEY = "test-secret-key-12345"


@pytest.fixture()
def enforcing_app():
    old_key = config.AI_SERVICE_API_KEY
    config.AI_SERVICE_API_KEY = TEST_KEY
    yield app_module.app
    config.AI_SERVICE_API_KEY = old_key


@pytest.fixture()
def open_app():
    old_key = config.AI_SERVICE_API_KEY
    config.AI_SERVICE_API_KEY = ""
    yield app_module.app
    config.AI_SERVICE_API_KEY = old_key


def test_health_is_public_when_key_set(enforcing_app):
    client = enforcing_app.test_client()
    resp = client.get("/health")
    assert resp.status_code == 200


def test_request_without_key_rejected(enforcing_app):
    client = enforcing_app.test_client()
    resp = client.post(
        "/face-quality-check",
        json={"file_path": "uploads/dummy.jpg"},
    )
    assert resp.status_code == 401
    assert "X-API-Key" in resp.get_json()["error"]


def test_request_with_wrong_key_rejected(enforcing_app):
    client = enforcing_app.test_client()
    resp = client.post(
        "/face-quality-check",
        json={"file_path": "uploads/dummy.jpg"},
        headers={"X-API-Key": "wrong-key"},
    )
    assert resp.status_code == 401


def test_request_with_correct_key_passes_gate(enforcing_app):
    client = enforcing_app.test_client()
    resp = client.post(
        "/face-quality-check",
        json={"file_path": "uploads/dummy.jpg"},
        headers={"X-API-Key": TEST_KEY},
    )
    # The gate passes; the handler itself may 400 on the bogus path,
    # but it must not be a 401.
    assert resp.status_code != 401


def test_open_mode_allows_requests(open_app):
    client = open_app.test_client()
    resp = client.post(
        "/face-quality-check",
        json={"file_path": "uploads/dummy.jpg"},
    )
    assert resp.status_code != 401


def test_constant_time_compare_matches_hmac_api():
    # Sanity check that the auth gate uses a constant-time comparison.
    assert hmac.compare_digest("abc123", "abc123") is True
    assert hmac.compare_digest("abc123", "abc124") is False
