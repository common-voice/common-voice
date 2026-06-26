"""mdc-disable: set prior MDC dataset versions to private (visibility=private).

Companion tool to the uploader. Scrapes the org page, resolves
each dataset id to its submission id, and PATCHes visibility=private with
429-aware pacing and local resume.
"""
