import React from 'react'
import { Localized } from '@fluent/react'

import { UploadIconLarge } from '../../../../../ui/icons'
import { Button } from '../../../../../ui/ui'
import { UploadStatus } from '../../../../../../hooks/use-bulk-submission-upload'

type Props = {
  isDragActive: boolean
  uploadStatus: UploadStatus
}

const UploadZoneContent: React.FC<Props> = ({ isDragActive, uploadStatus }) => {
  if (uploadStatus === 'uploading') {
    return <h1>Uploading...</h1>
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
          <h2 className="upload-dropzone-instruction" />
        </Localized>
      )}
      <Localized id="or-conjuction">
        <p className="or-conjunction" />
      </Localized>
      <Button>
        <Localized id="select-file" />
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
