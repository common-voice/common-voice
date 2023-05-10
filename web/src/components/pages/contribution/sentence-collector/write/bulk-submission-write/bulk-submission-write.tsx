import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { Instruction } from '../../instruction'
import {
  LightBulbIcon,
  UploadIcon,
  UploadIconLarge,
} from '../../../../../ui/icons'

import './bulk-submission-write.css'
import { Localized } from '@fluent/react'
import { Rules } from '../sentence-input-and-rules/rules'
import { Button } from '../../../../../ui/ui'
import ExpandableInformation from '../../../../../expandable-information/expandable-information'

const BulkSubmissionWrite = () => {
  // TODO: move this to useFileUpload hook
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log({ acceptedFiles })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  console.log({ inputProps: getInputProps() })

  return (
    <div className="bulk-upload-container">
      <div className="upload-and-instruction">
        <Instruction
          firstPartId="sc-bulk-upload-instruction-first-part"
          secondPartId="sc-bulk-upload-instruction-second-part"
          icon={<UploadIcon />}
        />
        <div className="upload-dropzone-and-rules">
          <div>
            <div
              data-testid="bulk-upload-dropzone"
              className="upload-dropzone"
              {...getRootProps()}>
              <input data-testid="file-input" {...getInputProps()} />
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
            </div>
            <div className="expandable-container">
              <ExpandableInformation
                summaryLocalizedId="what-needs-to-be-in-file"
                icon={<LightBulbIcon />}>
                <Localized id="what-needs-to-be-in-file-explanation">
                  <p />
                </Localized>
              </ExpandableInformation>
            </div>
          </div>
          <Rules showFirstRule title="sc-review-write-title" />
        </div>
      </div>
      <div className="buttons">
        <p>Some buttons</p>
      </div>
    </div>
  )
}

export default BulkSubmissionWrite
