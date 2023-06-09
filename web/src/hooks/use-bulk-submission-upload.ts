import { useState } from 'react'
import { format } from 'date-fns'

import { useAction } from './store-hooks'
import { Sentences } from '../stores/sentences'
import { useLocale } from '../components/locale-helpers'

export type UploadStatus = 'waiting' | 'uploading' | 'done' | 'error'

export type FileInfo = {
  name: string
  size: number
  lastModified: string
}

const useBulkSubmissionUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('waiting')
  const [fileInfo, setFileInfo] = useState<FileInfo>()

  const [locale] = useLocale()
  const bulkSubmissionRequest = useAction(
    Sentences.actions.bulkSubmissionRequest
  )
  const abortRequest = useAction(Sentences.actions.abortBulkSubmissionRequest)

  const handleDrop = (acceptedFiles: File[]) => {
    setUploadStatus('uploading')

    const [file] = acceptedFiles

    setFileInfo({
      name: file.name,
      size: file.size,
      lastModified: format(file.lastModified, 'LLL d yyyy'),
    })

    bulkSubmissionRequest({
      file,
      fileName: file.name,
      locale,
      setUploadStatus,
    })
  }

  return {
    handleDrop,
    uploadStatus,
    fileInfo,
    cancelBulkSubmission: () => abortRequest(),
  }
}

export default useBulkSubmissionUpload
