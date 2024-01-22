import React, { useState } from 'react'
import { Localized } from '@fluent/react'

import { LanguageDataset } from '../types'

import { MetaDataViewerItem } from './metadata-viewer-item'
import { useLocale } from '../../../../locale-helpers'

import './metadata-viewer.css'

type Props = {
  releaseData: LanguageDataset[]
}

export const MobileDatasetMetadataViewer = ({ releaseData }: Props) => {
  const [selected, setSelected] = useState<LanguageDataset>()

  const [locale] = useLocale()

  const handleSelect = (selectedId: number) => {
    setSelected(releaseData.find(el => el.id === selectedId))
  }

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
          onSelect={handleSelect}
          selectedId={selected?.id || releaseData[0].id}
        />
      ))}
    </div>
  )
}
