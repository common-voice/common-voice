import React from 'react'
import { Localized, useLocalization } from '@fluent/react'
import classNames from 'classnames'

import { CheckMark, ChevronDown } from '../../../../ui/icons'
import { LanguageDataset } from '../types'
import {
  formatBytes,
  msToHours,
  sortObjectByValue,
} from '../../../../../utility'
import { AgeSplits } from '../age-splits'
import { GenderSplits } from '../gender-splits'

type Props = {
  releaseData: LanguageDataset
  locale: string
  onSelect: (selecteId: number) => void
  selectedId: number
}

export const MetaDataViewerItem = ({
  releaseData,
  locale,
  onSelect,
  selectedId,
}: Props) => {
  const { l10n } = useLocalization()

  const isItemSelected = releaseData.id === selectedId

  const sortedAgeSplits = sortObjectByValue(
    releaseData?.splits?.age || {}
  ) as LanguageDataset['splits']['age']

  return (
    <div className="metadata-viewer-item">
      <div
        className={classNames('md-metadata-info', {
          selected: isItemSelected,
        })}
        onClick={() => onSelect(releaseData.id)}>
        <p className="release-name">
          {isItemSelected && <CheckMark />}
          {releaseData.name}
        </p>
        <div>
          <p className="dataset-release-date">
            {Intl.DateTimeFormat(locale).format(
              new Date(releaseData.release_date)
            )}
          </p>
          <ChevronDown className={isItemSelected ? 'expanded' : ''} />
        </div>
      </div>
      <div className={`expanded-box ${!isItemSelected ? 'collapsed' : ''}`}>
        <div>
          <p className="metadata">
            {l10n.getString('size')}
            <span>{formatBytes(releaseData.size, locale)}</span>
          </p>
          <p className="metadata">
            {l10n.getString('validated-hours')}
            <span>
              {Intl.NumberFormat(locale).format(
                msToHours(releaseData.valid_clips_duration)
              )}
            </span>
          </p>
          <p className="metadata">
            {l10n.getString('number-of-voices')}
            <span>
              {releaseData.total_users.toLocaleString(locale, {
                style: 'decimal',
              })}
            </span>
          </p>
          {releaseData?.splits?.age && (
            <div className="age">
              <Localized id="dataset-metadata-age">
                <p className="metadata" />
              </Localized>

              <AgeSplits ageSplits={sortedAgeSplits} />
            </div>
          )}
        </div>
        <div>
          <p className="metadata">
            {l10n.getString('recorded-hours')}
            <span>
              {Intl.NumberFormat(locale).format(
                msToHours(releaseData.total_clips_duration)
              )}
            </span>
          </p>
          <p className="metadata">
            {l10n.getString('cv-license')} <span>CC-0</span>
          </p>
          <p className="metadata">
            {l10n.getString('audio-format')} <span>MP3</span>
          </p>

          {releaseData?.splits?.gender && (
            <div className="sex">
              <Localized id="dataset-metadata-sex">
                <p className="metadata" />
              </Localized>

              <GenderSplits genderSplits={releaseData.splits.gender} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
