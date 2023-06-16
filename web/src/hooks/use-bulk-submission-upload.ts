import { useState } from 'react'
import { format } from 'date-fns'
import { useDispatch } from 'react-redux'

import { useAction, useSentences } from './store-hooks'
import { Sentences } from '../stores/sentences'
import { useLocale } from '../components/locale-helpers'
import { Notifications } from '../stores/notifications'
import { useLocalization } from '@fluent/react'

export type FileInfo = {
  name: string
  size: number
  lastModified: string
}

const useBulkSubmissionUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File>()
  const [fileInfo, setFileInfo] = useState<FileInfo>()
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

  const handleDrop = (acceptedFiles: File[]) => {
    dispatch(Sentences.actions.setBulkUploadStatus('waiting'))

    const [file] = acceptedFiles

    setUploadedFile(file)

    setFileInfo({
      name: file.name,
      size: file.size,
      lastModified: format(file.lastModified, 'LLL d yyyy'),
    })
  }

  const startUpload = async () => {
    try {
      await bulkSubmissionRequest({
        file: uploadedFile,
        fileName: uploadedFile.name,
        locale,
      })

      dispatch(Sentences.actions.setBulkUploadStatus('done'))
      dispatch(
        Notifications.actions.addPill(
          l10n.getString('bulk-upload-success-toast'),
          'success'
        )
      )
    } catch {
      dispatch(Sentences.actions.setBulkUploadStatus('error'))
      dispatch(
        Notifications.actions.addPill(
          l10n.getString('bulk-upload-failed-toast'),
          'error'
        )
      )
    }
  }

  return {
    handleDrop,
    uploadStatus: sentences[locale]?.bulkUploadStatus,
    fileInfo,
    abortBulkSubmissionRequest,
    startUpload,
    removeBulkSubmission,
  }
}

export default useBulkSubmissionUpload
