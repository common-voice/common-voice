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
        el => (
          <p key={el} className="gender">
            <span>{formatNumberToPercentage(genderSplits[el])}</span>
            {el.length > 0
              ? l10n.getString(el)
              : l10n.getString('no-information')}
          </p>
        )
      )}
    </div>
  )
}
