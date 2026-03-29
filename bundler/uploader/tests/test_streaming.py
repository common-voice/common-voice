"""Tests for streaming.py -- GCS-to-MDC direct streaming upload."""

from __future__ import annotations

import hashlib
import json
from unittest.mock import MagicMock, patch

import pytest

from mdc_uploader.streaming import (
    _initiate_upload_raw,
    _load_or_resume,
    stream_upload_from_gcs,
)


class TestInitiateUploadRaw:
    """Tests for _initiate_upload_raw -- bypasses SDK Pydantic model."""

    @patch("mdc_uploader.streaming._send_api_request")
    @patch("mdc_uploader.streaming._get_api_url", return_value="http://test/api")
    def test_sends_correct_payload(self, _mock_url, mock_req) -> None:
        """Sends submissionId, filename, fileSize, mimeType."""
        mock_resp = MagicMock()
        mock_resp.json.return_value = {
            "fileUploadId": "fup-1",
            "uploadId": "uid-1",
        }
        mock_req.return_value = mock_resp

        result = _initiate_upload_raw("sub-1", "test.tar.gz", 100_000_000)
        assert result["fileUploadId"] == "fup-1"
        mock_req.assert_called_once()
        payload = mock_req.call_args[1]["json_body"]
        assert payload["submissionId"] == "sub-1"
        assert payload["filename"] == "test.tar.gz"
        assert payload["fileSize"] == 100_000_000

    @patch("mdc_uploader.streaming._send_api_request")
    @patch("mdc_uploader.streaming._get_api_url", return_value="http://test/api")
    def test_accepts_over_80gb(self, _mock_url, mock_req) -> None:
        """No client-side rejection for files over 80 GB."""
        mock_resp = MagicMock()
        mock_resp.json.return_value = {
            "fileUploadId": "fup-big",
            "uploadId": "uid-big",
        }
        mock_req.return_value = mock_resp

        # 100 GB -- would fail with SDK's old 80 GB Pydantic limit
        result = _initiate_upload_raw("sub-1", "big.tar.gz", 100_000_000_000)
        assert result["fileUploadId"] == "fup-big"


class TestLoadOrResume:
    """Tests for _load_or_resume -- state loading and initiation."""

    @patch("mdc_uploader.streaming._initiate_upload_raw")
    @patch("mdc_uploader.streaming._save_upload_state")
    def test_fresh_upload_initiates(self, mock_save, mock_init, tmp_path) -> None:
        """No state file -> initiates new upload."""
        mock_init.return_value = {
            "fileUploadId": "fup-new",
            "uploadId": "uid-new",
            "partSize": 256 * 1024 * 1024,
        }

        state = _load_or_resume(
            tmp_path / "state.json", "sub-1", "test.tar.gz", 1000, 256,
        )
        assert state.fileUploadId == "fup-new"
        assert state.submissionId == "sub-1"
        mock_init.assert_called_once()
        mock_save.assert_called_once()

    @patch("mdc_uploader.streaming._initiate_upload_raw")
    @patch("mdc_uploader.streaming._save_upload_state")
    def test_mismatched_state_restarts(self, mock_save, mock_init, tmp_path) -> None:
        """State file with wrong submissionId triggers fresh initiation."""
        state_file = tmp_path / "state.json"
        state_file.write_text(json.dumps({
            "submissionId": "sub-WRONG",
            "fileUploadId": "fup-old",
            "uploadId": "uid-old",
            "fileSize": 1000,
            "partSize": 256,
            "filename": "test.tar.gz",
            "mimeType": "application/gzip",
            "parts": [],
            "checksum": None,
        }))

        mock_init.return_value = {
            "fileUploadId": "fup-fresh",
            "uploadId": "uid-fresh",
            "partSize": 256,
        }

        state = _load_or_resume(
            state_file, "sub-1", "test.tar.gz", 1000, 256,
        )
        assert state.fileUploadId == "fup-fresh"
        mock_init.assert_called_once()

    def test_matching_state_resumes(self, tmp_path) -> None:
        """State file matching submission/file/size is reused."""
        state_file = tmp_path / "state.json"
        state_file.write_text(json.dumps({
            "submissionId": "sub-1",
            "fileUploadId": "fup-existing",
            "uploadId": "uid-existing",
            "fileSize": 1000,
            "partSize": 256,
            "filename": "test.tar.gz",
            "mimeType": "application/gzip",
            "parts": [{"partNumber": 1, "etag": "abc"}],
            "checksum": None,
        }))

        state = _load_or_resume(
            state_file, "sub-1", "test.tar.gz", 1000, 256,
        )
        assert state.fileUploadId == "fup-existing"
        assert len(state.parts) == 1


class TestStreamUploadFromGcs:
    """Tests for stream_upload_from_gcs -- the core streaming loop."""

    def _setup_blob(self, data: bytes) -> MagicMock:
        """Create a mock GCS blob with range-read support."""
        blob = MagicMock()
        blob.size = len(data)

        def download_range(start: int, end: int) -> bytes:
            # GCS range reads are inclusive on both ends
            return data[start:end + 1]

        blob.download_as_bytes = MagicMock(side_effect=download_range)
        return blob

    @patch("mdc_uploader.streaming._complete_upload")
    @patch("mdc_uploader.streaming._extract_etag")
    @patch("mdc_uploader.streaming._upload_part_with_retry")
    @patch("mdc_uploader.streaming._get_presigned_part_url")
    @patch("mdc_uploader.streaming._initiate_upload_raw")
    @patch("mdc_uploader.streaming._save_upload_state")
    @patch("mdc_uploader.streaming.gcs_storage")
    def test_small_file_single_part(
        self, mock_gcs, mock_save, mock_init, mock_presigned,
        mock_put, mock_etag, mock_complete, tmp_path,
    ) -> None:
        """A file smaller than part_size uploads in one part."""
        data = b"hello world" * 100  # 1100 bytes
        blob = self._setup_blob(data)
        mock_gcs.Client.return_value.bucket.return_value.blob.return_value = blob

        mock_init.return_value = {
            "fileUploadId": "fup-1",
            "uploadId": "uid-1",
            "partSize": 4096,  # larger than data
        }
        mock_presigned.return_value = MagicMock(url="http://presigned/1")
        mock_put.return_value = MagicMock()
        mock_etag.return_value = "etag-1"

        state = stream_upload_from_gcs(
            bucket_name="test-bucket",
            blob_path="release/test.tar.gz",
            submission_id="sub-1",
            state_path=str(tmp_path / "state.json"),
            part_size=4096,
        )

        assert state.fileUploadId == "fup-1"
        assert state.checksum == hashlib.sha256(data).hexdigest()
        mock_presigned.assert_called_once()
        mock_put.assert_called_once()
        mock_complete.assert_called_once()

    @patch("mdc_uploader.streaming._complete_upload")
    @patch("mdc_uploader.streaming._extract_etag")
    @patch("mdc_uploader.streaming._upload_part_with_retry")
    @patch("mdc_uploader.streaming._get_presigned_part_url")
    @patch("mdc_uploader.streaming._initiate_upload_raw")
    @patch("mdc_uploader.streaming._save_upload_state")
    @patch("mdc_uploader.streaming.gcs_storage")
    def test_multi_part_upload(
        self, mock_gcs, mock_save, mock_init, mock_presigned,
        mock_put, mock_etag, mock_complete, tmp_path,
    ) -> None:
        """A file larger than part_size splits into multiple parts."""
        data = b"x" * 1000
        blob = self._setup_blob(data)
        mock_gcs.Client.return_value.bucket.return_value.blob.return_value = blob

        mock_init.return_value = {
            "fileUploadId": "fup-m",
            "uploadId": "uid-m",
            "partSize": 300,
        }
        mock_presigned.return_value = MagicMock(url="http://presigned")
        mock_put.return_value = MagicMock()
        mock_etag.side_effect = ["etag-1", "etag-2", "etag-3", "etag-4"]

        state = stream_upload_from_gcs(
            bucket_name="test-bucket",
            blob_path="release/test.tar.gz",
            submission_id="sub-1",
            state_path=str(tmp_path / "state.json"),
            part_size=300,
        )

        # ceil(1000/300) = 4 parts
        assert mock_presigned.call_count == 4
        assert mock_put.call_count == 4
        assert state.checksum == hashlib.sha256(data).hexdigest()

    @patch("mdc_uploader.streaming._complete_upload")
    @patch("mdc_uploader.streaming._extract_etag")
    @patch("mdc_uploader.streaming._upload_part_with_retry")
    @patch("mdc_uploader.streaming._get_presigned_part_url")
    @patch("mdc_uploader.streaming._save_upload_state")
    @patch("mdc_uploader.streaming.gcs_storage")
    def test_resume_skips_uploaded_parts(
        self, mock_gcs, mock_save, mock_presigned,
        mock_put, mock_etag, mock_complete, tmp_path,
    ) -> None:
        """Resuming skips already-uploaded parts but still reads for hash."""
        data = b"y" * 600
        blob = self._setup_blob(data)
        mock_gcs.Client.return_value.bucket.return_value.blob.return_value = blob

        # Pre-seed state file with part 1 already done
        state_file = tmp_path / "state.json"
        state_file.write_text(json.dumps({
            "submissionId": "sub-1",
            "fileUploadId": "fup-r",
            "uploadId": "uid-r",
            "fileSize": 600,
            "partSize": 300,
            "filename": "test.tar.gz",
            "mimeType": "application/gzip",
            "parts": [{"partNumber": 1, "etag": "etag-done"}],
            "checksum": None,
        }))

        mock_presigned.return_value = MagicMock(url="http://presigned")
        mock_put.return_value = MagicMock()
        mock_etag.return_value = "etag-2"

        state = stream_upload_from_gcs(
            bucket_name="test-bucket",
            blob_path="release/test.tar.gz",
            submission_id="sub-1",
            state_path=str(state_file),
            part_size=300,
        )

        # Part 1 skipped, only part 2 uploaded
        assert mock_presigned.call_count == 1
        assert mock_put.call_count == 1
        # But hash covers all data
        assert state.checksum == hashlib.sha256(data).hexdigest()

    @patch("mdc_uploader.streaming.gcs_storage")
    def test_empty_blob_raises(self, mock_gcs, tmp_path) -> None:
        """Zero-size blob raises ValueError."""
        blob = MagicMock()
        blob.size = 0
        mock_gcs.Client.return_value.bucket.return_value.blob.return_value = blob

        with pytest.raises(ValueError, match="no content"):
            stream_upload_from_gcs(
                bucket_name="b", blob_path="p",
                submission_id="s",
                state_path=str(tmp_path / "state.json"),
            )
