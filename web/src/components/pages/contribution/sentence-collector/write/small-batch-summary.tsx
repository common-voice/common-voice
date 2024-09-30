import React from 'react'
import { Localized } from '@fluent/react'

import { SmallBatchResponse } from './sentence-write/types'
import { invalidSmallBatchSentencesToTSVString } from '../../../../../utility'

type Props = {
  smallBatchResponse: SmallBatchResponse
}

export const SmallBatchSummary = ({ smallBatchResponse }: Props) => {
  const { validSentencesCount, totalCount, invalidSentences } =
    smallBatchResponse

  const smallBatchResponseReport =
    invalidSmallBatchSentencesToTSVString(invalidSentences)

  const blob = new Blob([smallBatchResponseReport], {
    type: 'text/tab-separated-values',
  })

  const href = URL.createObjectURL(blob)

  return (
    <Localized
      id="small-batch-response-message"
      vars={{
        uploadedSentences: validSentencesCount,
        totalSentences: totalCount,
      }}
      elems={{
        downloadLink: <a href={href} download="rejected-sentences.tsv" />,
      }}>
      <p className="small-batch-summary" />
    </Localized>
  )
}
