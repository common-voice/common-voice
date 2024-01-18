import React from 'react'
import { Localized } from '@fluent/react'

import { getVerticalOffset } from './get-vertical-offset'
import {
  formatNumberToPercentage,
  sortObjectByValue,
} from '../../../../../utility'

import './metadata-viewer.css'

export type DatasetMetadata = {
  gender: {
    male: number
    female: number
  }
  age: {
    '': number
    teens: number
    twenties: number
    thirties: number
    fourties: number
    fifties: number
    sixties: number
    seventies: number
    eighties: number
    nineties: number
  }
}

type Props = {
  selectedTableRowIndex: number
  datasetsCount: number
  metadata: DatasetMetadata
}

const AGE_MAPPING = {
  '': 'No information available',
  teens: '< 20',
  twenties: '20 - 29',
  thirties: '30 - 39',
  fourties: '40 - 49',
  fifties: '50 - 59',
  sixties: '60 - 69',
  seventies: '70 - 79',
  eighties: '80 - 89',
  nineties: '90 - 99',
}

export const DesktopMetaDataViewer = ({
  selectedTableRowIndex,
  datasetsCount,
  metadata,
}: Props) => {
  const { age, gender } = metadata

  const sortedAge = sortObjectByValue(age)

  return (
    <div className="metadata-viewer-container hidden-lg-down">
      <div
        style={{
          transform: `translateY(${getVerticalOffset({
            rowIndex: selectedTableRowIndex,
            datasetsCount,
          })})`,
        }}>
        <Localized id="datatset-splits">
          <p className="header" />
        </Localized>
        <div className="info">
          <div className="age-splits">
            {(Object.keys(sortedAge) as Array<keyof typeof age>).map(
              el =>
                el.length > 0 &&
                age[el] > 0 && (
                  <p key={el}>
                    <span>{formatNumberToPercentage(age[el])}</span>
                    {AGE_MAPPING[el]}
                  </p>
                )
            )}
          </div>

          <div className="gender-splits">
            {(Object.keys(gender) as Array<keyof typeof gender>).map(
              el =>
                el.length > 0 &&
                gender[el] > 0 && (
                  <p key={el} className="gender">
                    <span>{formatNumberToPercentage(gender[el])}</span>
                    {el}
                  </p>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
