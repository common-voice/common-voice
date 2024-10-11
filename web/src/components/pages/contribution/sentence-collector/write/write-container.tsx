import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'
import { secondsToMinutes } from 'date-fns'

import SentenceCollectionWrapper from '../sentence-collector-wrapper'
import { SentenceWrite, WriteMode } from './sentence-write'
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
import { RATE_LIMIT_EXCEEDED } from '../../../../../hooks/use-bulk-submission-upload'
import { SentenceSubmissionError } from 'common'

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
  const {
    handleCitationChange,
    handlePublicDomainChange,
    handleSentenceDomainChange,
    handleSentenceInputChange,
    handleSentenceVariantChange,
    handleSubmit,
    sentenceWriteState: {
      citation,
      sentenceVariant,
      sentenceDomains,
      error,
      sentence,
      smallBatchResponse: stateSmallBatchResponse,
      confirmPublicDomain,
    },
  } = useSentenceWrite(activeWriteOption as WriteMode)

  const variantTokens = variants ? variants.map(variant => variant.tag) : []
  const allVariants =
    variants &&
    ['sentence-variant-select-multiple-variants'].concat(variantTokens)

  const handleToggle = (option: WriteSubmissionToggleOptions) => {
    trackSingleSubmission('toggle-button-click', locale)
    setActiveWriteOption(option)
  }

  const isUploadDone = sentences[locale]?.bulkUploadStatus === 'done'

  const getRetryLimit = () => {
    if (activeWriteOption === 'small-batch') {
      return error?.data?.retryLimit as number
    }
    if (activeWriteOption === 'bulk') {
      return sentences[locale]?.bulkUploadStatusData?.retryLimit as number
    }
    return undefined
  }

  const retryLimit = getRetryLimit()

  const smallBatchResponse =
    stateSmallBatchResponse || JSON.parse(localStorage.getItem(SMALL_BATCH_KEY))

  const showSmallBatchSummary =
    activeWriteOption === 'small-batch' &&
    smallBatchResponse?.invalidSentences.length > 0

  const showRateLimitError =
    (activeWriteOption === 'small-batch' &&
      error?.type === SentenceSubmissionError.RATE_LIMIT_EXCEEDED) ||
    (activeWriteOption === 'bulk' &&
      sentences[locale]?.bulkUploadStatusData?.error === RATE_LIMIT_EXCEEDED)

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
    const sharedProps = {
      allVariants,
      handleCitationChange,
      handlePublicDomainChange,
      handleSentenceDomainChange,
      handleSentenceInputChange,
      handleSentenceVariantChange,
      handleSubmit,
      citation,
      sentence,
      sentenceVariant,
      selectedSentenceDomains: sentenceDomains,
      error,
      confirmPublicDomain,
    }

    switch (activeWriteOption) {
      case 'single':
        return <SentenceWrite {...sharedProps} mode={activeWriteOption} />
      case 'bulk':
        return <BulkSubmissionWrite />
      case 'small-batch':
        return <SentenceWrite {...sharedProps} mode={activeWriteOption} />
      default:
        return null
    }
  }

  return (
    <div className="write-container" data-testid="write-container">
      {showRateLimitError && (
        <Localized
          id={
            retryLimit > 60
              ? 'rate-limit-message-minutes'
              : 'rate-limit-message-seconds'
          }
          vars={{
            retryLimit:
              retryLimit > 60 ? secondsToMinutes(retryLimit) : retryLimit,
          }}>
          <p className="mobile-rate-limit-message" />
        </Localized>
      )}
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
        {showRateLimitError && (
          <Localized
            id={
              retryLimit > 60
                ? 'rate-limit-message-minutes'
                : 'rate-limit-message-seconds'
            }
            vars={{
              retryLimit:
                retryLimit > 60 ? secondsToMinutes(retryLimit) : retryLimit,
            }}>
            <p className="rate-limit-message" />
          </Localized>
        )}
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
