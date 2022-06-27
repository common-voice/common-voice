import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { PlayOutlineIcon, MicIcon, GlobeIcon } from '../../ui/icons';
import { Spinner } from '../../ui/ui';
import { CircleStat } from './circle-stats';
import DatasetDownloadEmailPrompt from './dataset-download-email-prompt';
import { getRelease, SEGMENT_RELEASE_ID } from './releases';
import { byteToSize } from '../../../utility';

import './dataset-segment-download.css';

const formatHrs = (hrs: number) => {
  return hrs < 1 ? Math.floor(hrs * 100) / 100 : Math.floor(hrs);
};

const DatasetSegmentDownload = ({ getString }: WithLocalizationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [releaseData, setReleaseData] = useState(null);

  useEffect(() => {
    getRelease(SEGMENT_RELEASE_ID)
      .then(setReleaseData)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Spinner isLight isFloating={false} />;
  }

  if (!releaseData) {
    return null;
  }

  const bundleState = {
    bundleLocale: 'overall',
    checksum: releaseData.overall.checksum,
    size: byteToSize(releaseData.overall.size, getString),
    language: '',
    totalHours: formatHrs(releaseData.totalHrs),
    validHours: formatHrs(releaseData.totalValidHrs),
    rawSize: releaseData.overall.size,
    releaseId: SEGMENT_RELEASE_ID,
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
                value={
                  Object.keys(releaseData.locales).filter(
                    locale => locale !== SEGMENT_RELEASE_ID
                  ).length
                }
                icon={<GlobeIcon />}
                {...dotSettings}
              />
            </div>
          </div>
          <DatasetDownloadEmailPrompt
            urlPattern={releaseData.bundleURL}
            bundleState={bundleState}
            isLight
          />
        </div>
      </div>
    </div>
  );
};

export default withLocalization(DatasetSegmentDownload);
