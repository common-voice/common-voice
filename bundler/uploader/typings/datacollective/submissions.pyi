"""Type stubs for datacollective.submissions."""

from typing import Any

from datacollective.models import DatasetSubmission

def create_submission_draft(submission: DatasetSubmission) -> dict[str, Any]: ...
def create_submission_with_upload(
    file_path: str,
    submission: DatasetSubmission,
    state_path: str | None = ...,
    verbose: bool = ...,
) -> dict[str, Any]: ...
def update_submission(submission_id: str, submission: DatasetSubmission) -> dict[str, Any]: ...
def submit_submission(submission_id: str, submission: DatasetSubmission) -> dict[str, Any]: ...
