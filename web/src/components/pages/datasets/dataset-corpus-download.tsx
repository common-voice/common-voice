import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { localeConnector } from '../../locale-helpers';
import useSortedLocales from '../../../hooks/use-sorted-locales';
import { LabeledSelect, Spinner } from '../../ui/ui';

import DatasetDownloadEmailPrompt from './dataset-download-email-prompt';

import './dataset-corpus-download.css';
import { useAPI } from '../../../hooks/store-hooks';
import DatasetCorpusDownloadTable from './dataset-corpus-download-table';
import PageHeading from '../../ui/page-heading';
import { formatBytes } from '../../../utility';
import { DeltaReadMoreLink } from '../../shared/links';

interface Props extends WithLocalizationProps {
  languagesWithDatasets: { id: number; name: string }[];
  initialLanguage: string;
  isSubscribedToMailingList: boolean;
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
  isSubscribedToMailingList,
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<LanguageDatasets>();
  const [languageDatasets, setLanguageDatasets] = useState<LanguageDatasets[]>(
    []
  );
  const api = useAPI();

  const [locale, setLocale] = useState(initialLanguage);
  const sortedLanguages = useSortedLocales(
    languagesWithDatasets.map(s => s.name),
    getString
  )[0];

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLocale = event.target.value;
    setLocale(newLocale);
  };

  const handleRowSelect = (selectedId: number) =>
    setSelectedDataset(languageDatasets.find(d => d.id === selectedId));

  useEffect(() => {
    setIsLoading(true);

    api.getLanguageDatasetStats(locale).then(data => {
      setLanguageDatasets(
        data.filter((dataset: LanguageDatasets) => !!dataset.download_path)
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
            {sortedLanguages.map(val => (
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
          {!isLoading && languageDatasets && (
            <DatasetCorpusDownloadTable
              onRowSelect={handleRowSelect}
              releaseData={languageDatasets}
              selectedId={selectedDataset?.id || languageDatasets[0].id}
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
      </div>
    </div>
  );
};

export default localeConnector(withLocalization(DatasetCorpusDownload));
