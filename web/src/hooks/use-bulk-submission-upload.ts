import { useState } from 'react'
import { format } from 'date-fns'

import { useAction } from './store-hooks'
import { Sentences } from '../stores/sentences'
import { useLocale } from '../components/locale-helpers'

export type UploadStatus = 'off' | 'waiting' | 'uploading' | 'done' | 'error'

export type FileInfo = {
  name: string
  size: number
  lastModified: string
}

const useBulkSubmissionUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('off')
  const [uploadedFile, setUploadedFile] = useState<File>()
  const [fileInfo, setFileInfo] = useState<FileInfo>()

  const [locale] = useLocale()

  const bulkSubmissionRequest = useAction(
    Sentences.actions.bulkSubmissionRequest
  )
  const abortRequest = useAction(Sentences.actions.abortBulkSubmissionRequest)

  const handleDrop = (acceptedFiles: File[]) => {
    setUploadStatus('waiting')

    const [file] = acceptedFiles

    setUploadedFile(file)

    setFileInfo({
      name: file.name,
      size: file.size,
      lastModified: format(file.lastModified, 'LLL d yyyy'),
    })
  }

  const startUpload = () => {
    bulkSubmissionRequest({
      file: uploadedFile,
      fileName: uploadedFile.name,
      locale,
      setUploadStatus,
    })

    setUploadStatus('uploading')
  }

  return {
    handleDrop,
    uploadStatus,
    fileInfo,
    cancelBulkSubmission: () => abortRequest(),
    startUpload,
  }
}

export default useBulkSubmissionUpload
