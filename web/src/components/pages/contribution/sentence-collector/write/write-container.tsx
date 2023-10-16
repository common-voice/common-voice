import * as React from 'react'

import SentenceCollectionWrapper from '../sentence-collector-wrapper'
import SingleSubmissionWrite from './single-submission-write/single-submission-write'
import BulkSubmissionWrite from './bulk-submission-write/bulk-submission-write'
import SentenceCollectorToggle from '../sentence-colector-toggle'
import BulkSubmissionSuccess from './bulk-submission-write/bulk-submission-success'

import { useAccount, useSentences } from '../../../../../hooks/store-hooks'
import { useLocale } from '../../../../locale-helpers'

import './write-container.css'

export type WriteSubmissionToggleOptions = 'single' | 'bulk'

const WriteContainer = () => {
  const [activeWriteOption, setActiveWriteOption] =
    React.useState<WriteSubmissionToggleOptions>('single')

  const handleToggle = (option: WriteSubmissionToggleOptions) => {
    setActiveWriteOption(option)
  }

  const account = useAccount()
  const sentences = useSentences()
  const [locale] = useLocale()

  const isUploadDone = sentences[locale]?.bulkUploadStatus === 'done'

  if (isUploadDone) {
    return (
      <div className="write-container">
        <BulkSubmissionSuccess />
      </div>
    )
  }

  return (
    <div className="write-container" data-testid="write-container">
      {account && (
        <div className="sc-toggle">
          <SentenceCollectorToggle
            onToggle={handleToggle}
            activeOption={activeWriteOption}
          />
        </div>
      )}
      <SentenceCollectionWrapper
        dataTestId="write-page"
        type="write"
        extraClassName={account ? '' : 'centered'}>
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
