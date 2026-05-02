import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { localeConnector } from '../../locale-helpers'
import useSortedLocales from '../../../hooks/use-sorted-locales'
import { LabeledSelect, Spinner } from '../../ui/ui'

import DatasetDownloadEmailPrompt from './dataset-download-email-prompt'
import { useAPI } from '../../../hooks/store-hooks'
import DatasetCorpusDownloadTable from './dataset-corpus-download-table'
import PageHeading from '../../ui/page-heading'
import { formatBytes } from '../../../utility'
import { DeltaReadMoreLink } from '../../shared/links'
import { MobileDatasetMetadataViewer } from './metadata-viewer/mobile/metadata-viewer'

import { LanguageDataset } from './metadata-viewer/types'

import { DesktopMetaDataViewer } from './metadata-viewer/desktop/metadata-viewer'

import './dataset-corpus-download.css'
import { trackGtag } from '../../../services/tracker-ga4'

interface Props extends WithLocalizationProps {
  languagesWithDatasets: { id: number; name: string }[]
  initialLanguage: string
  isSubscribedToMailingList: boolean
  onSelectDataset?: (selection: {
    dataset_id: number
    release_dir: string
  }) => void
}

const DatasetCorpusDownload = ({
  getString,
  languagesWithDatasets,
  initialLanguage,
  isSubscribedToMailingList,
  onSelectDataset,
}: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDataset, setSelectedDataset] = useState<LanguageDataset>()
  const [languageDatasets, setLanguageDatasets] = useState<LanguageDataset[]>(
    []
  )

  const [selectedTableRowIndex, setSelectedTableRowIndex] = useState(0)
  // Lifted out of the table so the choice survives locale-change remounts.
  const [showAllDownloads, setShowAllDownloads] = useState(false)
  const api = useAPI()

  const [locale, setLocale] = useState(initialLanguage)
  const sortedLanguages = useSortedLocales(
    languagesWithDatasets.map(s => s.name),
    getString
  )[0]

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLocale = event.target.value
    setLocale(newLocale)
  }

  const handleRowSelect = (selectedId: number, index: number) => {
    const newSelection = languageDatasets.find(d => d.id === selectedId)
    if (!newSelection) return

    trackGtag('datasets-table-row-click', {
      datasetLocaleId: newSelection.locale_id,
      datasetId: newSelection.dataset_id,
    })

    setSelectedDataset(newSelection)
    setSelectedTableRowIndex(index)
    onSelectDataset?.({
      dataset_id: newSelection.dataset_id,
      release_dir: newSelection.release_dir,
    })
  }

  useEffect(() => {
    setIsLoading(true)

    api.getLanguageDatasetStats(locale).then(data => {
      const filtered = data.filter(
        (dataset: LanguageDataset) => !!dataset.download_path
      )
      setLanguageDatasets(filtered)
      const initialSelection = filtered[0] ?? data[0]
      setSelectedDataset(initialSelection)
      setSelectedTableRowIndex(0)
      // Don't auto-fire onSelectDataset; the panel only reacts to user clicks.
      setIsLoading(false)
    })
  }, [locale])

  return (
    <div className="dataset-corpus-download">
      <div className="dataset-corpus-download-container">
        <div className="table-text">
          <PageHeading>
            <Localized id="download-dataset-header" />
          </PageHeading>
          <Localized
            id="download-delta-explainer"
            elems={{
              deltaLink: <DeltaReadMoreLink className="link" />,
            }}>
            <div />
          </Localized>
          <p style={{ marginTop: '2rem' }}>
            <Localized id="download-dataset-tag" />
          </p>
        </div>
        <div className="input-row">
          <LabeledSelect
            label={getString('language')}
            name="bundleLocale"
            value={locale}
            onChange={handleLanguageChange}>
            {sortedLanguages.map(val => (
              <Localized key={val} id={val}>
                <option value={val} />
              </Localized>
            ))}
          </LabeledSelect>
        </div>
        <div className="table-metadata-container">
          <div className="table-email-prompt-container">
            {isLoading && <Spinner />}
            {!isLoading && languageDatasets && (
              <DatasetCorpusDownloadTable
                onRowSelect={handleRowSelect}
                releaseData={languageDatasets}
                selectedId={selectedDataset?.id || languageDatasets[0].id}
                showAllDownloads={showAllDownloads}
                onToggleShowAllDownloads={() =>
                  setShowAllDownloads(prev => !prev)
                }
              />
            )}

            {!isLoading && languageDatasets && (
              <MobileDatasetMetadataViewer
                releaseData={languageDatasets}
                selectedId={selectedDataset?.id ?? null}
                onSelect={selectedId => {
                  const index = languageDatasets.findIndex(
                    d => d.id === selectedId
                  )
                  if (index >= 0) handleRowSelect(selectedId, index)
                }}
              />
            )}

            {selectedDataset && selectedDataset.download_path && (
              <DatasetDownloadEmailPrompt
                selectedLocale={locale}
                downloadPath={selectedDataset.download_path}
                releaseId={selectedDataset.id.toString()}
                checksum={selectedDataset.checksum}
                size={formatBytes(selectedDataset.size, initialLanguage)}
                isSubscribedToMailingList={isSubscribedToMailingList}
              />
            )}
          </div>

          {!isLoading && selectedDataset && selectedDataset.splits && (
            <DesktopMetaDataViewer
              selectedTableRowIndex={selectedTableRowIndex}
              datasetsCount={languageDatasets.length}
              splits={selectedDataset.splits}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default localeConnector(withLocalization(DatasetCorpusDownload))
