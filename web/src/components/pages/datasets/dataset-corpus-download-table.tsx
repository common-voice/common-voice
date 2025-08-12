import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react'
import classNames from 'classnames'
import * as React from 'react'
import { ChevronDown } from '../../ui/icons'
import { formatBytes, msToHours } from '../../../utility'
import { useLocale } from '../../locale-helpers'

import './dataset-corpus-download-table.css'

const DEFAULT_VISIBLE_COUNT = 6

interface Props {
  releaseData: any[]
  onRowSelect: (selectedId: number, index: number) => void
  selectedId: number | null
}

// map columns to localized string id
// also provide a fnc to render values in column
const COLUMNS: { [key: string]: any } = {
  name: {
    display: (value: string) => {
      return value
    },
    label: 'dataset-version',
  },
  release_date: {
    display: (value: string, locale: string) => {
      return Intl.DateTimeFormat(locale).format(new Date(value))
    },
    label: 'dataset-date',
  },
  size: {
    display: (value: number, locale: string) => {
      return formatBytes(value, locale)
    },
    label: 'size',
  },
  total_clips_duration: {
    display: (value: number, locale: string) => {
      return Intl.NumberFormat(locale).format(msToHours(value))
    },
    label: 'recorded-hours',
  },
  valid_clips_duration: {
    display: (value: number, locale: string) => {
      return Intl.NumberFormat(locale).format(msToHours(value))
    },
    label: 'validated-hours',
  },
  license: {
    display: () => {
      return 'CC-0'
    },
    label: 'cv-license',
  },
  total_users: {
    display: (value: number, locale: string) => {
      return value.toLocaleString(locale, {
        style: 'decimal',
      })
    },
    label: 'number-of-voices',
  },
  audio_format: {
    display: () => {
      return 'MP3'
    },
    label: 'audio-format',
  },
}

const DatasetCorpusDownloadTable = ({
  releaseData,
  onRowSelect,
  selectedId,
  getString,
}: Props & WithLocalizationProps) => {
  const [locale] = useLocale()

  const [showAllDownloads, setShowAllDownloads] = React.useState(false)

  const toggleShowAllDownloads = () => {
    setShowAllDownloads(!showAllDownloads)
  }

  const datasetsToShow = showAllDownloads
    ? releaseData
    : releaseData.slice(0, DEFAULT_VISIBLE_COUNT)

  return (
    <React.Fragment>
      {releaseData.length <= DEFAULT_VISIBLE_COUNT ? (
        <></>
      ) : (
        <div
          className="show-all-datasets hidden-md-down"
          onClick={toggleShowAllDownloads}>
          <Localized
            id={'datasets-show-' + (showAllDownloads ? 'less' : 'more')}
          />
          <ChevronDown className={showAllDownloads ? 'expanded' : ''} />
        </div>
      )}
      <table className="table dataset-table hidden-md-down">
        <thead>
          <tr>
            {Object.values(COLUMNS).map(column => {
              return (
                <th key={column.label}>
                  <Localized id={column.label} />
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {datasetsToShow.map((row, index) => {
            return (
              <tr
                onClick={() => onRowSelect(row.id, index)}
                className={classNames({ selected: row.id === selectedId })}
                key={row.id + row.release_dir}>
                {Object.keys(COLUMNS).map((col: string, index) => {
                  const { label, display } = COLUMNS[col]
                  return (
                    <td
                      data-mobile-label={getString(label)}
                      key={index + label}
                      className={index < 3 ? 'highlight' : ''}>
                      {display(row[col], locale)}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </React.Fragment>
  )
}

export default withLocalization(DatasetCorpusDownloadTable)
