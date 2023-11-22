import { useState } from 'react'
import { format } from 'date-fns'
import { useDispatch } from 'react-redux'
import { FileRejection } from 'react-dropzone'
import { useLocalization } from '@fluent/react'

import { useAction, useSentences } from './store-hooks'
import { Sentences } from '../stores/sentences'
import { useLocale } from '../components/locale-helpers'
import { Notifications } from '../stores/notifications'
import { trackBulkSubmission } from '../services/tracker'

export type FileInfo = {
  name: string
  size: number
  lastModified: string
}

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
