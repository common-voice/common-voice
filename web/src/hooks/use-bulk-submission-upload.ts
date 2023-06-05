import { useState } from 'react'
import { format } from 'date-fns'

import { useAction, useSentences } from './store-hooks'
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
  const bulkUploadSentence = useAction(Sentences.actions.bulkUploadSentence)
  const sentences = useSentences()

  const handleDrop = (acceptedFiles: File[]) => {
    setUploadStatus('uploading')

    const [file] = acceptedFiles

    setFileInfo({
      name: file.name,
      size: file.size,
      lastModified: format(file.lastModified, 'LLL d yyyy'),
    })

    try {
      bulkUploadSentence({
        file,
        fileName: file.name,
        locale,
        setUploadStatus,
      })
    } catch {
      setUploadStatus('error')
    }
  }

  return {
    handleDrop,
    uploadStatus,
    uploadProgress: sentences[locale]?.bulkUploadProgress,
    fileInfo,
  }
}

export default useBulkSubmissionUpload
