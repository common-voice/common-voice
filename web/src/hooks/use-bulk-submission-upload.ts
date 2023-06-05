import { useState } from 'react'

import { useAction } from './store-hooks'
import { Sentences } from '../stores/sentences'
import { useLocale } from '../components/locale-helpers'

export type UploadStatus = 'off' | 'waiting' | 'uploading' | 'done' | 'error'

const useBulkSubmissionUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('off')
  const [locale] = useLocale()
  const bulkUploadSentence = useAction(Sentences.actions.bulkUploadSentence)

  const handleDrop = (acceptedFiles: File[]) => {
    setUploadStatus('waiting')

    const [file] = acceptedFiles

    bulkUploadSentence({
      file,
      fileName: file.name,
      locale,
    })
  }

  return {
    handleDrop,
    uploadStatus,
  }
}

export default useBulkSubmissionUpload
