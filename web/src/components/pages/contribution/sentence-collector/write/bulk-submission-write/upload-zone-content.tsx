import React from 'react'
import { Localized } from '@fluent/react'
import { filesize } from 'filesize'

import { UploadIconLarge } from '../../../../../ui/icons'
import { Button, Spinner } from '../../../../../ui/ui'
import {
  FileInfo,
  UploadStatus,
} from '../../../../../../hooks/use-bulk-submission-upload'

type Props = {
  isDragActive: boolean
  uploadStatus: UploadStatus
  uploadProgress: number
  fileInfo: FileInfo
  cancelBulkSubmission: () => void
}

const UploadZoneContent: React.FC<Props> = ({
  isDragActive,
  uploadStatus,
  uploadProgress,
  fileInfo,
  cancelBulkSubmission,
}) => {
  if (uploadStatus === 'uploading' && fileInfo) {
    return (
      <div className="uploading-container">
        <div className="progress-container">
          <span style={{ width: `${uploadProgress}%` }} className="progress" />
        </div>
        <button onClick={cancelBulkSubmission}>Cancel Upload</button>
        <Spinner isFloating={false} />
        <Localized
          id="upload-progress-text"
          vars={{ progress: uploadProgress }}>
          <p className="upload-progress-text" />
        </Localized>
        <p className="file-name">{fileInfo?.name}</p>
        <p className="file-size">
          {filesize(fileInfo?.size)} • {fileInfo?.lastModified}
        </p>
      </div>
    )
  }

  if (uploadStatus === 'done') {
    return <h1>Done...</h1>
  }

  if (uploadStatus === 'error') {
    return <h1>An error occurred</h1>
  }

  return (
    <>
      <UploadIconLarge />
      {isDragActive ? (
        <Localized id="drop-file-here">
          <h2 className="upload-dropzone-instruction" />
        </Localized>
      ) : (
        <Localized id="drag-your-file-here">
          <h2 className="upload-dropzone-instruction hidden-md-down" />
        </Localized>
      )}
      <Localized id="or-conjuction">
        <p className="or-conjunction hidden-md-down" />
      </Localized>
      <Button className="hidden-md-down">
        <Localized id="select-file" />
      </Button>
      <Button className="hidden-lg-up">
        <Localized id="select-file-mobile" />
      </Button>
      <div className="file-restrictions">
        <Localized id="accepted-files">
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
