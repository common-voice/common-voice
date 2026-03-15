"""Constants for the MDC uploader."""

from mdc_uploader.typedef import DescriptionTemplate, MDCTarget

MDC_API_URLS: dict[MDCTarget, str] = {
    "dev": "https://dev.datacollective.mozillafoundation.org/api",
    "prod": "https://datacollective.mozillafoundation.org/api",
}

# Common Voice language data API
CV_API_BASE = "https://commonvoice.mozilla.org/api/v1"

# Default GCSFuse mount point
DEFAULT_BASE_DIR = "/gcs"

# MDC metadata constants
POINT_OF_CONTACT_NAME = "Mozilla Foundation"
POINT_OF_CONTACT_EMAIL = "commonvoice@mozilla.com"

FORBIDDEN_USAGE = (
    "It is forbidden to attempt to determine the identity of speakers in the "
    "Common Voice datasets. It is forbidden to re-host or re-share this dataset."
)

INTENDED_USAGE = (
    "This dataset is intended to be used for training and evaluating automatic "
    "speech recognition (ASR) models. It may also be used for applications "
    "relating to computer-aided language learning (CALL) and language or "
    "heritage revitalisation."
)

RESTRICTIONS = "None provided."

# Description templates per modality
DESCRIPTIONS: dict[str, DescriptionTemplate] = {
    "scs": {
        "short": "A collection of read speech recordings in {english}.",
        "long": "A collection of read speech recordings in {english} ({native}).",
    },
    "sps": {
        "short": "A collection of spontaneous responses to questions in {english}.",
        "long": "A collection of spontaneous responses to questions in {english} ({native}).",
    },
}

# Max Retry-After value (seconds) before giving up on a 429
MAX_RETRY_AFTER_SECONDS = 3600
