import React from 'react'
import { Localized, useLocalization } from '@fluent/react'

import { getVerticalOffset } from './get-vertical-offset'
import { formatNumberToPercentage } from '../../../../utility'

import './desktop-metadata-viewer.css'

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
  const { l10n } = useLocalization()

  return (
    <div className="metadata-viewer-container hidden-lg-down">
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
        <div className="info">
          <div className="age-splits">
            {(Object.keys(age) as Array<keyof typeof age>).map(el =>
              el ? (
                <p key={el}>
                  <span>{formatNumberToPercentage(age[el])}</span>
                  {AGE_MAPPING[el]}
                </p>
              ) : (
                <p
                  title={l10n.getString('no-information-available')}
                  className="no-information">
                  <span>{formatNumberToPercentage(age[el])}</span>
                  {l10n.getString('no-information-available')}
                </p>
              )
            )}
          </div>

          <div className="gender-splits">
            {(Object.keys(gender) as Array<keyof typeof gender>).map(el =>
              el ? (
                <p key={el} className="gender">
                  <span>{formatNumberToPercentage(gender[el])}</span>
                  {el}
                </p>
              ) : (
                <p
                  title={l10n.getString('no-information-available')}
                  className="no-information">
                  <span>{formatNumberToPercentage(gender[el])}</span>
                  {l10n.getString('no-information-available')}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
