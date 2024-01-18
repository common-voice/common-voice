import React from 'react'
import { Localized, useLocalization } from '@fluent/react'
import classNames from 'classnames'

import { CheckMark, ChevronDown } from '../../../../ui/icons'
import { LanguageDataset } from '../types'
import { formatBytes, msToHours } from '../../../../../utility'

type Props = {
  releaseData: LanguageDataset
  locale: string
  onSelect: (selecteId: number) => void
  selectedId: number
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

export const MetaDataViewerItem = ({
  releaseData,
  locale,
  onSelect,
  selectedId,
}: Props) => {
  const { l10n } = useLocalization()

  const isItemSelected = releaseData.id === selectedId

  const { splits: { age, gender } = {} } = releaseData

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

              <div className="age-splits">
                {(Object.keys(AGE_MAPPING) as Array<keyof typeof age>).map(
                  el =>
                    el.length > 0 &&
                    age[el] > 0 && (
                      <p key={el}>
                        <span>{`${Math.round(age[el] * 100)}%`}</span>
                        {AGE_MAPPING[el]}
                      </p>
                    )
                )}
              </div>
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

              <div className="gender-splits">
                {(
                  Object.keys(releaseData.splits.gender) as Array<
                    keyof typeof gender
                  >
                ).map(
                  el =>
                    el.length > 0 &&
                    gender[el] > 0 && (
                      <p key={el} className="gender">
                        <span>{`${Math.round(gender[el] * 100)}%`}</span>
                        {el}
                      </p>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
