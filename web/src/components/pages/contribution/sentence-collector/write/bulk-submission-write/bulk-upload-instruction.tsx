import { Localized } from '@fluent/react'
import * as React from 'react'
import { FileRejection } from 'react-dropzone'

import { trackBulkSubmission } from '../../../../../../services/tracker'
import { useLocale } from '../../../../../locale-helpers'

type Props = {
  isDragActive: boolean
  isUploadError: boolean
  fileRejections: FileRejection[]
  openDialog: () => void
}

const BulkUploadInstruction: React.FC<Props> = ({
  isDragActive,
  isUploadError,
  fileRejections,
  openDialog,
}) => {
  const [locale] = useLocale()

  const handleClick = () => {
    openDialog()
    trackBulkSubmission('upload-button-click', locale)
  }

  if (!isUploadError) {
    if (isDragActive) {
      return (
        <Localized id="sc-bulk-upload-instruction-drop">
          <h2 className="upload-dropzone-instruction" />
        </Localized>
      )
    }

    return (
      <Localized
        id="sc-bulk-upload-instruction"
        elems={{
          uploadButton: (
            <button
              onClick={handleClick}
              className="upload"
              data-testid="upload-btn"
            />
          ),
        }}>
        <h2
          className="upload-dropzone-instruction hidden-md-down"
          data-testid="upload-dropzone-instruction"
        />
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
      <ul>
        {fileRejections?.map(({ file, errors }) => (
          <li key={file.name}>
            {errors.map(e => (
              <p key={e.code}>
                <Localized id={e.code} />
              </p>
            ))}
          </li>
        ))}
      </ul>
    </>
  )
}

export default BulkUploadInstruction
