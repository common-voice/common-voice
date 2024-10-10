import { useState } from 'react'
import { format, secondsToMinutes } from 'date-fns'
import { useDispatch } from 'react-redux'
import { FileRejection } from 'react-dropzone'
import { useLocalization } from '@fluent/react'

import { useAction, useSentences } from './store-hooks'
import { Sentences } from '../stores/sentences'
import { useLocale } from '../components/locale-helpers'
import { Notifications } from '../stores/notifications'
import { trackBulkSubmission } from '../services/tracker'
import { AlertIcon } from '../components/ui/icons'

export type FileInfo = {
  name: string
  size: number
  lastModified: string
}

export const RATE_LIMIT_EXCEEDED = 'Rate Limit Exceeded'

const useBulkSubmissionUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File>()
  const [fileInfo, setFileInfo] = useState<FileInfo>()
  const [fileRejections, setFileRejections] = useState<FileRejection[]>()

  const dispatch = useDispatch()
  const { l10n } = useLocalization()

  const [locale] = useLocale()
  const sentences = useSentences()

  const bulkSubmissionRequest = useAction(
    Sentences.actions.bulkSubmissionRequest
  )

  const abortBulkSubmissionRequest = useAction(
    Sentences.actions.abortBulkSubmissionRequest
  )

  const removeBulkSubmission = useAction(Sentences.actions.removeBulkSubmission)

  const handleDrop = (
    acceptedFiles: File[],
    fileRejections: FileRejection[]
  ) => {
    dispatch(Sentences.actions.setBulkUploadStatus('waiting'))

    const [file] = acceptedFiles

    setFileRejections(fileRejections)

    if (file) {
      setUploadedFile(file)

      setFileInfo({
        name: file.name,
        size: file.size,
        lastModified: format(file.lastModified, 'LLL d yyyy'),
      })
    } else {
      dispatch(Sentences.actions.setBulkUploadStatus('error'))
    }
  }

  const handleError = () => {
    dispatch(Sentences.actions.setBulkUploadStatus('error'))
    dispatch(
      Notifications.actions.addPill(
        l10n.getString('bulk-upload-failed-toast'),
        'error'
      )
    )
  }

  const handleRateLimitError = (retryLimit: number) => {
    const parsedRetryLimit =
      retryLimit > 60 ? secondsToMinutes(retryLimit) : retryLimit

    dispatch(
      Sentences.actions.setBulkUploadStatus('error', {
        retryLimit,
        error: RATE_LIMIT_EXCEEDED,
      })
    )
    dispatch(
      Notifications.actions.addPill(
        retryLimit > 60
          ? l10n.getString('rate-limit-toast-message-minutes', {
              retryLimit: parsedRetryLimit,
            })
          : l10n.getString('rate-limit-toast-message-seconds', {
              retryLimit: parsedRetryLimit,
            }),
        'error',
        AlertIcon
      )
    )
  }

  const startUpload = async () => {
    try {
      const response = await bulkSubmissionRequest({
        file: uploadedFile,
        fileName: uploadedFile.name,
        locale,
      })

      if (response.ok) {
        dispatch(Sentences.actions.setBulkUploadStatus('done'))
        dispatch(
          Notifications.actions.addPill(
            l10n.getString('bulk-upload-success-toast'),
            'success'
          )
        )
        trackBulkSubmission('submit', locale)
      } else if (response.status === 429) {
        const retryLimit = Number(response.headers.get('retry-after'))
        handleRateLimitError(retryLimit)
      } else {
        handleError()
      }
    } catch {
      handleError()
    }
  }

  return {
    handleDrop,
    uploadStatus: sentences[locale]?.bulkUploadStatus,
    fileInfo,
    abortBulkSubmissionRequest,
    startUpload,
    removeBulkSubmission,
    fileRejections,
  }
}

export default useBulkSubmissionUpload
