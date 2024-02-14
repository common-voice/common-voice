import React from 'react'
import { useLocalization } from '@fluent/react'

import { Gender } from './types'
import { formatNumberToPercentage } from '../../../../utility'

type Props = {
  genderSplits: Gender
}

export const GenderSplits = ({ genderSplits }: Props) => {
  const { l10n } = useLocalization()

  return (
    <div className="gender-splits">
      {(Object.keys(genderSplits) as Array<keyof typeof genderSplits>).map(
        el =>
          el.length > 0 &&
          genderSplits[el] > 0 && (
            <p key={el} className="gender">
              <span>{formatNumberToPercentage(genderSplits[el])}</span>
              {l10n.getString(el)}
            </p>
          )
      )}
    </div>
  )
}
