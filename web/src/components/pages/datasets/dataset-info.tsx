import * as React from 'react';
import { useEffect, useState } from 'react';
import { CloudIcon } from '../../ui/icons';
import { Spinner } from '../../ui/ui';

import { getRelease, CURRENT_RELEASE_ID } from './releases';

import DatasetIntro from './dataset-intro';
import DatasetCorpusDownload from './dataset-corpus-download';
import DatasetSegmentDownload from './dataset-segment-download';
import DatasetDescription from './dataset-description';

import './dataset-info.css';

const DatasetInfo = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [releaseId, setReleaseId] = useState(CURRENT_RELEASE_ID);
  const [releaseData, setReleaseData] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getRelease(releaseId)
      .then(setReleaseData)
      .finally(() => {
        setIsLoading(false);
      });
  }, [releaseId]);

  return (
    <div className="dataset-info">
      <div className="top">
        <div className="cloud-circle">
          <CloudIcon />
        </div>
        <DatasetIntro />
        {isLoading ? (
          <div className="dataset-corpus-download-placeholder">
            <Spinner isFloating={false} />
          </div>
        ) : (
          <DatasetCorpusDownload
            releaseData={releaseData}
            releaseId={releaseId}
            setReleaseId={setReleaseId}
          />
        )}
      </div>

      {isLoading ? (
        <Spinner isFloating={false} />
      ) : (
        <DatasetDescription releaseData={releaseData} />
      )}

      <DatasetSegmentDownload />
    </div>
  );
};

export default DatasetInfo;
