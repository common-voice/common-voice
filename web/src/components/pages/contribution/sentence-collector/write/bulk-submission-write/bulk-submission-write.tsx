import React from 'react'

import { Instruction } from '../../instruction'
import { UploadIcon } from '../../../../../ui/icons'

const BulkSubmissionWrite = () => {
  return (
    <div className="upload-container">
      <div className="upload-and-instruction">
        <Instruction
          firstPartId="sc-bulk-upload-instruction-first-part"
          secondPartId="sc-bulk-upload-instruction-second-part"
          icon={<UploadIcon />}
        />
      </div>
      <div className="buttons">
        <p>Some buttons</p>
      </div>
    </div>
  )
}

export default BulkSubmissionWrite
