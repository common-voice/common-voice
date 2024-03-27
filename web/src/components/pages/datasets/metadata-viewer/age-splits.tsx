import React from 'react'
import { useLocalization } from '@fluent/react'

import { Age } from './types'
import { AGE_MAPPING } from './constants'
import { formatNumberToPercentage } from '../../../../utility'

type Props = {
  ageSplits: Age
}

export const AgeSplits = ({ ageSplits }: Props) => {
  const { l10n } = useLocalization()

  return (
    <div className="age-splits">
      {(Object.keys(ageSplits) as Array<keyof typeof ageSplits>).map(el => (
        <p key={el}>
          <span>{formatNumberToPercentage(ageSplits[el])}</span>
          {el.length > 0 ? AGE_MAPPING[el] : l10n.getString('no-information')}
        </p>
      ))}
    </div>
  )
}
