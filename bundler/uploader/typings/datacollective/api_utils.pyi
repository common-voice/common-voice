"""Type stubs for datacollective.api_utils (v0.4.5)."""

from typing import Any

import requests

def _get_api_url() -> str: ...
def _send_api_request(
    method: str,
    url: str,
    json_body: dict[str, Any] | None = ...,
    **kwargs: Any,
) -> requests.Response: ...
def _format_bytes(size: int) -> str: ...
