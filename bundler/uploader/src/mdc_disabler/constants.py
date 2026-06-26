"""Org-page scrape host + org id per target for mdc-disable.

Dev is a different org than prod (the prod org id 404s on dev).
MDC_ORG_ID env overrides the org id.
"""

from mdc_uploader.typedef import MDCTarget

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
