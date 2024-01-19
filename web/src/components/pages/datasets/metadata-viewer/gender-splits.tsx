import React from 'react'

import { Gender } from './types'
import { formatNumberToPercentage } from '../../../../utility'

type Props = {
  genderSplits: Gender
}

export const GenderSplits = ({ genderSplits }: Props) => (
  <div className="gender-splits">
    {(Object.keys(genderSplits) as Array<keyof typeof genderSplits>).map(
      el =>
        el.length > 0 &&
        genderSplits[el] > 0 && (
          <p key={el} className="gender">
            <span>{formatNumberToPercentage(genderSplits[el])}</span>
            {el}
          </p>
        )
    )}
  </div>
)
