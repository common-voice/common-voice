import * as React from 'react'

import SentenceCollectionWrapper from '../sentence-collector-wrapper'
import { SentenceWrite } from './sentence-write'
import BulkSubmissionWrite from './bulk-submission-write/bulk-submission-write'
import SentenceCollectorToggle from '../sentence-collector-toggle'
import BulkSubmissionSuccess from './bulk-submission-write/bulk-submission-success'

import { useAccount, useSentences } from '../../../../../hooks/store-hooks'
import { useLocale } from '../../../../locale-helpers'
import { useGetVariants } from './sentence-write/hooks/use-get-variants'

import { trackSingleSubmission } from '../../../../../services/tracker'

import './write-container.css'

export type WriteSubmissionToggleOptions = 'single' | 'bulk' | 'small-batch'

const WriteContainer = () => {
  const [activeWriteOption, setActiveWriteOption] =
    React.useState<WriteSubmissionToggleOptions>('single')

  const [locale] = useLocale()
  const account = useAccount()
  const sentences = useSentences()
  const { variants } = useGetVariants()

  const variantTokens = variants ? variants.map(variant => variant.tag) : []

  // add all variants option to the list of variants in the dropdown
  const allVariants =
    variants &&
    ['sentence-variant-select-multiple-variants'].concat(variantTokens)

  const handleToggle = (option: WriteSubmissionToggleOptions) => {
    trackSingleSubmission('toggle-button-click', locale)
    setActiveWriteOption(option)
  }

  const isUploadDone = sentences[locale]?.bulkUploadStatus === 'done'

  if (isUploadDone) {
    return (
      <div className="write-container">
        <BulkSubmissionSuccess />
      </div>
    )
  }

  const getWriteComponent = (
    activeWriteOption: WriteSubmissionToggleOptions
  ) => {
    if (activeWriteOption === 'single') {
      return (
        <SentenceWrite
          allVariants={allVariants}
          instructionLocalizedId="write-instruction"
          mode={activeWriteOption}
        />
      )
    }

    if (activeWriteOption === 'bulk') {
      return <BulkSubmissionWrite />
    }

    if (activeWriteOption === 'small-batch') {
      return (
        <SentenceWrite
          allVariants={allVariants}
          instructionLocalizedId="small-batch-instruction"
          mode={activeWriteOption}
        />
      )
    }
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
        {getWriteComponent(activeWriteOption)}
      </SentenceCollectionWrapper>
    </div>
  )
}

export default WriteContainer
