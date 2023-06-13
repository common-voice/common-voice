import { Localized } from '@fluent/react'
import * as React from 'react'

type Props = {
  isDragActive: boolean
  isUploadError: boolean
}

const BulkUploadInstruction: React.FC<Props> = ({
  isDragActive,
  isUploadError,
}) => {
  if (!isUploadError) {
    if (isDragActive) {
      return (
        <Localized id="drop-file-here">
          <h2 className="upload-dropzone-instruction" />
        </Localized>
      )
    }

    return (
      <Localized id="drag-your-file-here">
        <h2 className="upload-dropzone-instruction hidden-md-down" />
      </Localized>
    )
  }

  return (
    <>
      <Localized id="try-upload-again">
        <h2 className="upload-dropzone-instruction hidden-sm-down" />
      </Localized>
      <Localized id="try-upload-again-md">
        <h2 className="upload-dropzone-instruction hidden-md-up" />
      </Localized>
    </>
  )
}

export default BulkUploadInstruction
