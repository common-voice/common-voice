import { Localized, withLocalization } from '@fluent/react';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { PlayOutlineIcon, MicIcon, GlobeIcon } from '../../ui/icons';
import { Spinner } from '../../ui/ui';
import { CircleStat } from './circle-stats';
import DatasetDownloadEmailPrompt from './dataset-download-email-prompt';
import { formatBytes, msToHours } from '../../../utility';

import './dataset-segment-download.css';
import { useAPI } from '../../../hooks/store-hooks';
import { Dataset, Datasets } from 'common';
import { useLocale } from '../../locale-helpers';

const DatasetSegmentDownload = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [releaseData, setReleaseData] = useState<Dataset>();
  const api = useAPI();
  useEffect(() => {
    setIsLoading(true);
    api.getDatasets('singleword').then((data: Datasets) => {
      setReleaseData(data[0]);
      setIsLoading(false);
    });
  }, []);
  const [locale] = useLocale();

  if (isLoading) {
    return <Spinner isLight isFloating={false} />;
  }

  if (!releaseData) {
    return null;
  }

  const bundleState = {
    bundleLocale: 'overall',
    checksum: releaseData.checksum,
    size: formatBytes(releaseData.size, locale),
    language: '',
    totalHours: msToHours(releaseData.total_clips_duration),
    validHours: msToHours(releaseData.valid_clips_duration),
    rawSize: releaseData.size,
    id: releaseData.id,
  };

  const dotSettings = {
    dotBackground: '#121217',
    dotColor: '#4a4a4a',
    dotSpace: 15,
    dotWidth: 100,
  };

  return (
    <div className="dataset-segment-download">
      <div className="dataset-segment-content">
        <div className="dataset-segment-intro">
          <h2 className="dataset-segment-callout">
            <Localized id="data-download-singleword-title" />
          </h2>
          <Localized id="data-download-singleword-callout-v2">
            <p id="description-hours" />
          </Localized>
        </div>
        <div className="dataset-segment-stats">
          <div className="circle-stats">
            <div className="circle-stat-wrapper">
              <CircleStat
                className="valid-hours"
                label="validated-hours"
                value={bundleState.validHours}
                icon={<PlayOutlineIcon />}
                {...dotSettings}
              />
            </div>
            <div className="circle-stat-wrapper">
              <CircleStat
                className="total-hours"
                label="recorded-hours"
                value={bundleState.totalHours}
                icon={<MicIcon />}
                {...dotSettings}
              />
            </div>
            <div className="circle-stat-wrapper">
              <CircleStat
                className="languages"
                label="languages"
                value={releaseData.languages_count}
                icon={<GlobeIcon />}
                {...dotSettings}
              />
            </div>
          </div>
          <DatasetDownloadEmailPrompt
            downloadPath={releaseData.download_path}
            checksum={bundleState.checksum}
            size={bundleState.size}
            releaseId={bundleState?.id?.toString()}
            selectedLocale={null}
            isLight
          />
        </div>
      </div>
    </div>
  );
};

export default withLocalization(DatasetSegmentDownload);
