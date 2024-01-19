import React from 'react'
import { Localized } from '@fluent/react'

import { getVerticalOffset } from './get-vertical-offset'
import { sortObjectByValue } from '../../../../../utility'
import { LanguageDataset } from '../types'

import './metadata-viewer.css'
import { AgeSplits } from '../age-splits'
import { GenderSplits } from '../gender-splits'

type Props = {
  selectedTableRowIndex: number
  datasetsCount: number
  splits: LanguageDataset['splits']
}

export const DesktopMetaDataViewer = ({
  selectedTableRowIndex,
  datasetsCount,
  splits,
}: Props) => {
  const { age, gender } = splits

  const sortedAgeSplits = sortObjectByValue(
    age
  ) as LanguageDataset['splits']['age']

  return (
    <div className="metadata-viewer-container hidden-lg-down">
      <div
        style={{
          transform: `translateY(${getVerticalOffset({
            rowIndex: selectedTableRowIndex,
            datasetsCount,
          })})`,
        }}>
        <Localized id="dataset-splits">
          <p className="header" />
        </Localized>
        <div className="info">
          <AgeSplits ageSplits={sortedAgeSplits} />
          <GenderSplits genderSplits={gender} />
        </div>
      </div>
    </div>
  )
}
