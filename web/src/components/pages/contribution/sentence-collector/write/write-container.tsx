import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import SentenceCollectionWrapper from '../sentence-collector-wrapper'
import { SentenceWrite } from './sentence-write'
import BulkSubmissionWrite from './bulk-submission-write/bulk-submission-write'
import SentenceCollectorToggle from '../sentence-collector-toggle'
import BulkSubmissionSuccess from './bulk-submission-write/bulk-submission-success'
import { SmallBatchSummary } from './small-batch-summary'
import { Instruction } from '../instruction'
import { EditIcon, UploadIcon } from '../../../../ui/icons'

import { useAccount, useSentences } from '../../../../../hooks/store-hooks'
import { useLocale } from '../../../../locale-helpers'
import { useGetVariants } from './sentence-write/hooks/use-get-variants'
import {
  SMALL_BATCH_KEY,
  useSentenceWrite,
} from './sentence-write/hooks/use-sentence-write'

import { trackSingleSubmission } from '../../../../../services/tracker'

import './write-container.css'

export type WriteSubmissionToggleOptions = 'single' | 'bulk' | 'small-batch'

const instructionIconMapping = {
  single: {
    instruction: 'write-instruction',
    icon: <EditIcon />,
  },
  'small-batch': {
    instruction: 'small-batch-instruction',
    icon: <EditIcon />,
  },
  bulk: {
    instruction: 'sc-bulk-upload-header',
    icon: <UploadIcon />,
  },
}

const WriteContainer = () => {
  const [activeWriteOption, setActiveWriteOption] =
    React.useState<WriteSubmissionToggleOptions>('single')

  const [locale] = useLocale()
  const account = useAccount()
  const sentences = useSentences()
  const { variants } = useGetVariants()
  const { sentenceWriteState } = useSentenceWrite('small-batch')

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

  const smallBatchResponse =
    sentenceWriteState?.smallBatchResponse ||
    JSON.parse(localStorage.getItem(SMALL_BATCH_KEY))

  const showSmallBatchSummary =
    activeWriteOption === 'small-batch' &&
    smallBatchResponse?.invalidSentences.length > 0

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
        <SentenceWrite allVariants={allVariants} mode={activeWriteOption} />
      )
    }

    if (activeWriteOption === 'bulk') {
      return <BulkSubmissionWrite />
    }

    if (activeWriteOption === 'small-batch') {
      return (
        <SentenceWrite allVariants={allVariants} mode={activeWriteOption} />
      )
    }
  }

  return (
    <div className="write-container" data-testid="write-container">
      {showSmallBatchSummary && (
        <div className="mobile-small-batch-summary">
          <SmallBatchSummary smallBatchResponse={smallBatchResponse} />
        </div>
      )}
      {account && (
        <div className="sc-toggle-wrapper">
          <SentenceCollectorToggle
            onToggle={handleToggle}
            activeOption={activeWriteOption}
          />
        </div>
      )}
      <div
        className={classNames('instruction-and-form-wrapper', {
          centered: !account,
        })}>
        {showSmallBatchSummary && (
          <div className="small-batch-summary">
            <SmallBatchSummary smallBatchResponse={smallBatchResponse} />
          </div>
        )}
        <Instruction
          localizedId={instructionIconMapping[activeWriteOption].instruction}
          icon={instructionIconMapping[activeWriteOption].icon}
        />
        {activeWriteOption !== 'bulk' && (
          <Localized id="write-page-subtitle">
            <p className="subtitle" />
          </Localized>
        )}
        <SentenceCollectionWrapper dataTestId="write-page" type="write">
          {getWriteComponent(activeWriteOption)}
        </SentenceCollectionWrapper>
      </div>
    </div>
  )
}

export default WriteContainer
