import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { Instruction } from '../../instruction'
import {
  LightBulbIcon,
  QuestionIcon,
  SendIcon,
  UploadIcon,
} from '../../../../../ui/icons'
import { Rules } from '../sentence-input-and-rules/rules'
import { LinkButton } from '../../../../../ui/ui'
import ExpandableInformation from '../../../../../expandable-information/expandable-information'
import UploadZoneContent from './upload-zone-content'

import URLS from '../../../../../../urls'
import { COMMON_VOICE_EMAIL } from '../../../../../../constants'
import useBulkSubmissionUpload from '../../../../../../hooks/use-bulk-submission-upload'

import './bulk-submission-write.css'

const BulkSubmissionWrite = () => {
  const { handleDrop, uploadStatus, fileInfo, cancelBulkSubmission } =
    useBulkSubmissionUpload()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(handleDrop, []),
    accept: { 'text/tab-separated-values': ['.tsv'] },
    multiple: false,
    disabled: uploadStatus === 'uploading' || uploadStatus === 'done',
  })

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
              className={classNames('upload-dropzone', {
                'file-uploading': uploadStatus === 'uploading',
              })}
              {...getRootProps()}>
              <input data-testid="file-input" {...getInputProps()} />
              <UploadZoneContent
                isDragActive={isDragActive}
                uploadStatus={uploadStatus}
                fileInfo={fileInfo}
                cancelBulkSubmission={cancelBulkSubmission}
              />
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
