"""Type stubs for datacollective.upload (v0.4.5)."""

from datacollective.upload_utils import UploadState

def upload_dataset_file(
    file_path: str,
    submission_id: str,
    state_path: str | None = ...,
    show_progress: bool = ...,
    enable_logging: bool = ...,
) -> UploadState: ...
