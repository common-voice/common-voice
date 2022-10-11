import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { localeConnector, LocaleLink } from '../../locale-helpers';
import useSortedLocales from '../../../hooks/use-sorted-locales';
import { LabeledSelect, Spinner } from '../../ui/ui';

import DatasetDownloadEmailPrompt from './dataset-download-email-prompt';

import './dataset-corpus-download.css';
import { useAPI } from '../../../hooks/store-hooks';
import DatasetCorpusDownloadTable from './dataset-corpus-download-table';
import PageHeading from '../../ui/page-heading';
import { formatBytes } from '../../../utility';
import PageTextContent from '../../ui/page-text-content';
import { Link } from 'react-router-dom';
import { DeltaReadMoreLink } from '../../shared/links';
interface Props {
  languagesWithDatasets: { id: number; name: string }[];
  initialLanguage: string;
}

type LanguageDatasets = {
  download_path: string;
  id: number;
  checksum: string;
  size: number;
};

const DatasetCorpusDownload = ({
  getString,
  languagesWithDatasets,
  initialLanguage,
}: Props & WithLocalizationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<LanguageDatasets>();
  const [LanguageDatasets, setLanguageDatasets] = useState<LanguageDatasets[]>(
    []
  );
  const api = useAPI();

  const [locale, setLocale] = useState(initialLanguage);
  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLocale = event.target.value;
    console.log('new', newLocale);

    setLocale(newLocale);
  };

  useEffect(() => {
    setIsLoading(true);

    api.getLanguageDatasetStats(locale).then(data => {
      setLanguageDatasets(
        data.filter(
          (dataset: LanguageDatasets) =>
            !!dataset.checksum && !!dataset.download_path
        )
      );
      setSelectedDataset(data[0]);
      setIsLoading(false);
    });
  }, [locale]);
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
            {useSortedLocales(
              languagesWithDatasets.map(s => s.name),
              getString
            )[0].map(val => (
              <Localized key={val} id={val}>
                <option value={val} />
              </Localized>
            ))}
          </LabeledSelect>
        </div>
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'start',
            flexDirection: 'column',
          }}>
          {isLoading && <Spinner />}
          {!isLoading && LanguageDatasets && (
            <DatasetCorpusDownloadTable
              onRowSelect={(selectedId: number) =>
                setSelectedDataset(
                  LanguageDatasets.find(d => d.id === selectedId)
                )
              }
              releaseData={LanguageDatasets}
              selectedId={selectedDataset?.id || LanguageDatasets[0].id}
            />
          )}

          {selectedDataset && selectedDataset.download_path && (
            <>
              <DatasetDownloadEmailPrompt
                selectedLocale={locale}
                downloadPath={selectedDataset.download_path}
                releaseId={selectedDataset.id.toString()}
                checksum={selectedDataset.checksum}
                size={formatBytes(selectedDataset.size, initialLanguage)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default localeConnector(withLocalization(DatasetCorpusDownload));
