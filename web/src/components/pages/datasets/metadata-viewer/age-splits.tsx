import React from 'react'

import { Age } from './types'
import { AGE_MAPPING } from './constants'
import { formatNumberToPercentage } from '../../../../utility'

type Props = {
  ageSplits: Age
}

export const AgeSplits = ({ ageSplits }: Props) => (
  <div className="age-splits">
    {(Object.keys(ageSplits) as Array<keyof typeof ageSplits>).map(
      el =>
        el.length > 0 &&
        ageSplits[el] > 0 && (
          <p key={el}>
            <span>{formatNumberToPercentage(ageSplits[el])}</span>
            {AGE_MAPPING[el]}
          </p>
        )
    )}
  </div>
)
