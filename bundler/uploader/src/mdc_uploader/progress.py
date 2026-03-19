"""Progress bar helpers using tqdm."""

from __future__ import annotations

from typing import NoReturn

from tqdm import tqdm


def batch_progress(
    total: int,
    desc: str = "Batch",
    unit: str = "locales",
) -> tqdm[NoReturn]:
    """Create a batch-level progress bar (manual .update()/.close())."""
    return tqdm(
        total=total,
        desc=desc,
        unit=unit,
        bar_format="{desc}: {n_fmt}/{total_fmt} {unit} [{elapsed}<{remaining}]",
    )


def format_size(size_bytes: int) -> str:
    """Format bytes as human-readable size."""
    value = float(size_bytes)
    for unit in ("B", "KB", "MB", "GB", "TB"):
        if abs(value) < 1024.0:
            return f"{value:.1f} {unit}"
        value /= 1024.0
    return f"{value:.1f} PB"
