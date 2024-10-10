import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { Localized } from '@fluent/react'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import { LightBulbIcon, QuestionIcon, SendIcon } from '../../../../../ui/icons'
import { Rules } from '../sentence-input-and-rules/rules'
import { LinkButton } from '../../../../../ui/ui'
import ExpandableInformation from '../../../../../expandable-information/expandable-information'
import UploadZoneContent from './upload-zone-content'

import URLS from '../../../../../../urls'
import { COMMON_VOICE_EMAIL } from '../../../../../../constants'
import useBulkSubmissionUpload from '../../../../../../hooks/use-bulk-submission-upload'
import { useAccount } from '../../../../../../hooks/store-hooks'
import { Sentences } from '../../../../../../stores/sentences'
import { useLocale } from '../../../../../locale-helpers'
import { trackBulkSubmission } from '../../../../../../services/tracker'

import './bulk-submission-write.css'

const MAX_FILE_SIZE = 1024 * 1024 * 25

const BulkSubmissionWrite = () => {
  const dispatch = useDispatch()
  const [locale] = useLocale()
  const account = useAccount()

  React.useEffect(() => {
    dispatch(Sentences.actions.setBulkUploadStatus('off'))
  }, [])

  const {
    handleDrop,
    uploadStatus,
    fileInfo,
    abortBulkSubmissionRequest,
    removeBulkSubmission,
    startUpload,
    fileRejections,
  } = useBulkSubmissionUpload()

  const isDropZoneDisabled =
    uploadStatus === 'waiting' ||
    uploadStatus === 'uploading' ||
    uploadStatus === 'done'

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: React.useCallback(handleDrop, []),
    accept: { 'text/tab-separated-values': ['.tsv'] },
    multiple: false,
    disabled: isDropZoneDisabled,
    noClick: true,
    maxSize: MAX_FILE_SIZE,
  })

  const handleToggle = (evt: React.SyntheticEvent<HTMLDetailsElement>) => {
    if (evt.currentTarget.open) {
      trackBulkSubmission('expandable-information-click-open', locale)
    } else {
      trackBulkSubmission('expandable-information-click-close', locale)
    }
  }

  return (
    <div className="bulk-upload-container" data-testid="bulk-upload-container">
      <div className="upload-and-instruction">
        <div className="upload-dropzone-and-rules">
          <div>
            <div
              data-testid="bulk-upload-dropzone"
              className={classNames('upload-dropzone', {
                'no-border':
                  uploadStatus === 'uploading' || uploadStatus === 'waiting',
              })}
              {...getRootProps()}>
              <input data-testid="file-input" {...getInputProps()} />
              <UploadZoneContent
                isDragActive={isDragActive}
                uploadStatus={uploadStatus}
                fileInfo={fileInfo}
                abortBulkSubmissionRequest={abortBulkSubmissionRequest}
                removeBulkSubmission={removeBulkSubmission}
                startUpload={startUpload}
                fileRejections={fileRejections}
                openDialog={open}
              />
            </div>
            <div className="expandable-container">
              <ExpandableInformation
                summaryLocalizedId="what-needs-to-be-in-file"
                icon={<LightBulbIcon />}
                onToggle={handleToggle}
                dataTestId="bulk-option-expandable-information">
                <Localized
                  id="what-needs-to-be-in-file-explanation"
                  elems={{
                    templateFileLink: (
                      <a
                        href="https://github.com/common-voice/common-voice/blob/main/docs/sample-bulk-submission.tsv"
                        target="_blank"
                        rel="noreferrer"
                      />
                    ),
                  }}>
                  <p />
                </Localized>
                <Localized
                  id="template-file-additional-information"
                  elems={{
                    emailFragment: (
                      <a
                        href="mailto:commonvoice@mozilla.com"
                        target="_blank"
                        rel="noreferrer"
                      />
                    ),
                  }}>
                  <p className="template-additional-information" />
                </Localized>
              </ExpandableInformation>
            </div>
          </div>
          <Rules
            showFirstRule
            localizedTitleId="sc-review-write-title"
            isLoggedIn={Boolean(account)}
          />
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
