import React from 'react'
import { Localized } from '@fluent/react'

import { getVerticalOffset } from './get-vertical-offset'
import { formatNumberToPercentage } from '../../../../utility'

export type DatasetMetadata = {
  gender: {
    male: number
    female: number
  }
  age: {
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

// TODO: move this to constants
const AGE_MAPPING = {
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

  return (
    <div className="metadata-viewer-container hidden-md-down">
      <div
        style={{
          transform: `translateY(${getVerticalOffset({
            rowIndex: selectedTableRowIndex,
            datasetsCount,
          })})`,
        }}
        className="hidden-lg-down">
        <Localized id="datatset-splits">
          <p className="header" />
        </Localized>
        <div
          className="info"
          style={{
            paddingInlineStart: '24px',
            paddingBlock: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          {(Object.keys(age) as Array<keyof typeof age>).map(
            el =>
              el && (
                <p key={el}>
                  <span style={{ fontWeight: 'bold' }}>
                    {formatNumberToPercentage(age[el])}
                  </span>{' '}
                  {AGE_MAPPING[el]}
                </p>
              )
          )}

          {(Object.keys(gender) as Array<keyof typeof gender>).map(
            el =>
              el && (
                <p key={el} style={{ textTransform: 'capitalize' }}>
                  <span style={{ fontWeight: 'bold' }}>
                    {formatNumberToPercentage(gender[el])}
                  </span>{' '}
                  {el}
                </p>
              )
          )}
        </div>
      </div>
    </div>
  )
}
