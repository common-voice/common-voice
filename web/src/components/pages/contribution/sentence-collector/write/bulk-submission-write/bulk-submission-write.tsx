import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Localized } from '@fluent/react'

import { Instruction } from '../../instruction'
import {
  LightBulbIcon,
  QuestionIcon,
  SendIcon,
  UploadIcon,
  UploadIconLarge,
} from '../../../../../ui/icons'
import { Rules } from '../sentence-input-and-rules/rules'
import { Button, LinkButton } from '../../../../../ui/ui'
import ExpandableInformation from '../../../../../expandable-information/expandable-information'

import URLS from '../../../../../../urls'

import './bulk-submission-write.css'
import { COMMON_VOICE_EMAIL } from '../../../../../../constants'

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
        <div>
          <LinkButton
            rounded
            outline
            className="guidelines-button"
            blank
            to={URLS.GUIDELINES}>
            <QuestionIcon />
            <Localized id="guidelines">
              <span />
            </Localized>
          </LinkButton>
          <LinkButton
            rounded
            outline
            blank
            href={`mailto:${COMMON_VOICE_EMAIL}`}>
            <SendIcon />
            <Localized id="contact-us">
              <span />
            </Localized>
          </LinkButton>
        </div>
      </div>
    </div>
  )
}

export default BulkSubmissionWrite
