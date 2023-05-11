import React, { useState } from 'react'

import SentenceCollectionWrapper from '../sentence-collector-wrapper'
import SingleSubmissionWrite from './single-submission-write/single-submission-write'
import BulkSubmissionWrite from './bulk-submission-write/bulk-submission-write'
import SentenceCollectorToggle from '../sentence-colector-toggle'

import { useAccount } from '../../../../../hooks/store-hooks'

import './write-container.css'

export type WriteSubmissionToggleOptions = 'single' | 'bulk'

const WriteContainer = () => {
  const [activeWriteOption, setActiveWriteOption] =
    useState<WriteSubmissionToggleOptions>('single')

  const handleToggle = (option: WriteSubmissionToggleOptions) => {
    setActiveWriteOption(option)
  }

  const account = useAccount()

  return (
    <div className="write-container">
      {account && (
        <div className="sc-toggle">
          <SentenceCollectorToggle
            singleOptionId="single-sentence-submission"
            bulkOptionId="bulk-sentence-submission"
            onToggle={handleToggle}
            activeOption={activeWriteOption}
          />
        </div>
      )}
      <SentenceCollectionWrapper
        dataTestId="write-page"
        type="write"
        extraClassName={account ? 'logged-in' : ''}>
        {activeWriteOption === 'single' ? (
          <SingleSubmissionWrite />
        ) : (
          <BulkSubmissionWrite />
        )}
      </SentenceCollectionWrapper>
    </div>
  )
}

export default WriteContainer
