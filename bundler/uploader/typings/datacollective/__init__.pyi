"""Type stubs for datacollective SDK v0.4.2."""

from datacollective.models import DatasetSubmission as DatasetSubmission
from datacollective.models import License as License
from datacollective.models import Task as Task
from datacollective.submissions import (
    create_submission_draft as create_submission_draft,
)
from datacollective.submissions import (
    create_submission_with_upload as create_submission_with_upload,
)
from datacollective.submissions import submit_submission as submit_submission
from datacollective.submissions import update_submission as update_submission
from datacollective.upload import upload_dataset_file as upload_dataset_file

__version__: str
