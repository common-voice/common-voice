import * as React from 'react'
import { Localized } from '@fluent/react'
import { filesize } from 'filesize'
import { FileRejection } from 'react-dropzone'

import { CloseIcon, FileIcon, UploadIconLarge } from '../../../../../ui/icons'
import { Button, LabeledCheckbox, Spinner } from '../../../../../ui/ui'
import { FileInfo } from '../../../../../../hooks/use-bulk-submission-upload'
import { PrimaryButton } from '../../../../../primary-buttons/primary-buttons'
import BulkUploadInstruction from './bulk-upload-instruction'
import { BulkUploadStatus } from 'common'

type Props = {
  isDragActive: boolean
  uploadStatus: BulkUploadStatus
  fileInfo: FileInfo
  abortBulkSubmissionRequest: () => void
  removeBulkSubmission: () => void
  startUpload: () => void
  fileRejections: FileRejection[]
  openDialog: () => void
}

const UploadZoneContent: React.FC<Props> = ({
  isDragActive,
  uploadStatus,
  fileInfo,
  abortBulkSubmissionRequest,
  removeBulkSubmission,
  startUpload,
  fileRejections,
  openDialog,
}) => {
  const [confirmPublicDomain, setConfirmPublicDomain] = React.useState(false)

  const handleConfirmPublicDomainChange = () => {
    setConfirmPublicDomain(!confirmPublicDomain)
  }

  if (uploadStatus === 'waiting' && fileInfo) {
    return (
      <div className="waiting-container">
        <CloseIcon
          onClick={removeBulkSubmission}
          black
          className="close-icon"
        />
        <div className="file-icon-container">
          <FileIcon />
        </div>
        <p className="file-name">{fileInfo?.name}</p>
        <p className="file-size">
          {filesize(fileInfo?.size)} • {fileInfo?.lastModified}
        </p>
        <LabeledCheckbox
          label={
            <Localized
              id="sc-bulk-submit-confirm"
              elems={{
                wikipediaLink: (
                  <a
                    href="https://en.wikipedia.org/wiki/Public_domain"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
              }}>
              <span />
            </Localized>
          }
          checked={confirmPublicDomain}
          onChange={handleConfirmPublicDomainChange}
          data-testid="public-domain-checkbox"
        />
        <Localized id="submit-form-action">
          <PrimaryButton
            className="submit"
            onClick={startUpload}
            disabled={!confirmPublicDomain}
            data-testid="submit-button"
          />
        </Localized>
        <Localized
          id="bulk-upload-additional-information"
          elems={{
            emailFragment: (
              <a
                href="mailto:commonvoice@mozilla.com"
                target="_blank"
                rel="noreferrer"
              />
            ),
          }}>
          <p className="upload-additional-information" />
        </Localized>
      </div>
    )
  }

  if (uploadStatus === 'uploading' && fileInfo) {
    return (
      <div className="uploading-container">
        <CloseIcon
          onClick={abortBulkSubmissionRequest}
          black
          className="close-icon"
        />
        <Spinner isFloating={false} />
        <Localized id="upload-progress-text">
          <p className="upload-progress-text" />
        </Localized>
        <p className="file-name">{fileInfo?.name}</p>
        <p className="file-size">
          {filesize(fileInfo?.size)} • {fileInfo?.lastModified}
        </p>
      </div>
    )
  }

  return (
    <>
      <UploadIconLarge />
      <BulkUploadInstruction
        isDragActive={isDragActive}
        isUploadError={uploadStatus === 'error'}
        fileRejections={fileRejections}
        openDialog={openDialog}
      />
      <Button className="hidden-lg-up" onClick={openDialog}>
        <Localized id="select-file-mobile" />
      </Button>
      <div className="file-restrictions">
        <Localized id="accepted-files">
          <p />
        </Localized>
        <Localized id="minimum-sentences">
          <p />
        </Localized>
        <Localized id="maximum-file-size">
          <p />
        </Localized>
      </div>
    </>
  )
}
export default UploadZoneContent
