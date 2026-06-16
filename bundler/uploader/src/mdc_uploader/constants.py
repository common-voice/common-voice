"""Constants for the MDC uploader."""

from mdc_uploader.typedef import DescriptionTemplate, MDCTarget

MDC_API_URLS: dict[MDCTarget, str] = {
    "dev": "https://dev.mozilladatacollective.com/api",
    "prod": "https://mozilladatacollective.com/api",
}

# Common Voice language data API
CV_API_URL = "https://commonvoice.mozilla.org/api/v1/languagedata"

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

# Org-page scrape host + org id for --disable-prior, per target. Dev is a different org
# than prod (the prod org id 404s on dev). MDC_ORG_ID env overrides the org id.
MDC_SITE_URLS: dict[MDCTarget, str] = {
    "dev": "https://dev.mozilladatacollective.com",
    "prod": "https://mozilladatacollective.com",
}
MDC_ORG_IDS: dict[MDCTarget, str] = {
    "prod": "cmfh0j9o10006ns07jq45h7xk",
    "dev": "",  # TODO: dev org id (or set MDC_ORG_ID env)
}
MDC_SITE_BASE = MDC_SITE_URLS["prod"]
MDC_ORG_ID = MDC_ORG_IDS["prod"]
