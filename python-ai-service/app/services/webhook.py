import requests
import json
import threading

def trigger_webhook(webhook_url: str, payload: dict, secret_token: str = None):
    """
    Asynchronously fires a webhook to the provided URL with the processing results.
    """
    def _fire():
        headers = {'Content-Type': 'application/json'}
        if secret_token:
            headers['X-SnapPass-Signature'] = secret_token
            
        try:
            requests.post(webhook_url, json=payload, headers=headers, timeout=10)
            # In a production system, you would log success or queue for retry on failure
        except requests.exceptions.RequestException as e:
            print(f"Webhook delivery failed to {webhook_url}: {e}")

    # Run in a separate thread so it doesn't block the API response
    thread = threading.Thread(target=_fire)
    thread.daemon = True
    thread.start()
