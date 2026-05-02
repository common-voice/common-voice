import React from 'react'
import { Localized } from '@fluent/react'

import { LanguageDataset } from '../types'

import { MetaDataViewerItem } from './metadata-viewer-item'
import { useLocale } from '../../../../locale-helpers'

import './metadata-viewer.css'

type Props = {
  releaseData: LanguageDataset[]
  selectedId: number | null
  onSelect: (selectedId: number) => void
}

export const MobileDatasetMetadataViewer = ({
  releaseData,
  selectedId,
  onSelect,
}: Props) => {
  const [locale] = useLocale()

  return (
    <div className="metadata-viewer-container-md hidden-lg-up">
      <div className="header-container">
        <Localized id="release-version">
          <p />
        </Localized>
        <Localized id="dataset-date">
          <p />
        </Localized>
      </div>
      {releaseData.map(el => (
        <MetaDataViewerItem
          releaseData={el}
          locale={locale}
          key={el.id}
          onSelect={onSelect}
          selectedId={selectedId ?? releaseData[0].id}
        />
      ))}
    </div>
  )
}
