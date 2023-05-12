import { useState } from 'react'

export type UploadStatus = 'off' | 'waiting' | 'uploading' | 'done' | 'error'

const useBulkSubmissionUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('off')

  const fakeAPI = () => {
    setUploadStatus('uploading')
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Hello world')
        setUploadStatus('done')
      }, 6000)
    })
  }

  const handleDrop = (acceptedFiles: File[]) => {
    setUploadStatus('waiting')
    console.log({ acceptedFiles })
    fakeAPI()
  }

  return {
    handleDrop,
    uploadStatus,
  }
}

export default useBulkSubmissionUpload
