"""Type stubs for datacollective.upload."""

from typing import Any

def upload_dataset_file(
    file_path: str,
    submission_id: str,
    state_path: str | None = ...,
    verbose: bool = ...,
    show_progress: bool = ...,
) -> Any: ...
