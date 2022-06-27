import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { localeConnector, useLocale } from '../../locale-helpers';
import useSortedLocales from '../../../hooks/use-sorted-locales';
import { ReleaseData } from './types';
import { byteToSize } from '../../../utility';
import { LabeledSelect } from '../../ui/ui';
import { RELEASES } from './releases';

import DatasetCorpusDownloadStats from './dataset-corpus-download-stats';
import DatasetDownloadEmailPrompt from './dataset-download-email-prompt';

import './dataset-corpus-download.css';

const formatHrs = (hrs: number) => {
  return hrs < 1 ? Math.floor(hrs * 100) / 100 : Math.floor(hrs);
};

interface Props {
  releaseData: ReleaseData;
  releaseId: string;
  setReleaseId: (id: string) => void;
}

const DatasetCorpusDownload = ({
  getString,
  releaseData,
  releaseId,
  setReleaseId,
}: Props & WithLocalizationProps) => {
  const generateBundleState = (bundleLocale: string, releaseId: string) => {
    const { checksum, size, totalHrs, validHrs } = releaseData.locales[locale];

    return {
      bundleLocale,
      checksum,
      rawSize: size,
      size: byteToSize(size, getString),
      language: getString(bundleLocale),
      totalHours: formatHrs(totalHrs),
      validHours: formatHrs(validHrs),
      releaseId,
    };
  };

  const [globalLocale] = useLocale();
  const [sortedLocales] = useSortedLocales(
    Object.keys(releaseData.locales),
    getString
  );
  const [locale, setLocale] = useState(
    releaseData.locales[globalLocale] ? globalLocale : 'en'
  );

  const bundleState = generateBundleState(locale, releaseId);

  const handleLangChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLocale = event.target.value;
    setLocale(newLocale);
  };

  const handleVersionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newReleaseId = event.target.value;
    setReleaseId(newReleaseId);
  };

  return (
    <div className="dataset-corpus-download">
      <div className="inner">
        <LabeledSelect
          label={getString('release-version')}
          name="releaseId"
          value={bundleState.releaseId}
          onChange={handleVersionChange}>
          {RELEASES.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </LabeledSelect>

        <LabeledSelect
          label={getString('language')}
          name="bundleLocale"
          value={locale}
          onChange={handleLangChange}>
          {sortedLocales.map(locale => (
            <Localized key={locale} id={locale}>
              <option value={locale} />
            </Localized>
          ))}
        </LabeledSelect>

        <ul className="facts">
          <DatasetCorpusDownloadStats
            releaseData={releaseData}
            bundleState={bundleState}
          />
        </ul>
        <DatasetDownloadEmailPrompt
          urlPattern={
            releaseData.bundleURLTemplate
              ? releaseData.bundleURLTemplate
              : releaseData.bundleUrl
          }
          bundleState={bundleState}
        />
      </div>
    </div>
  );
};

export default localeConnector(withLocalization(DatasetCorpusDownload));
