import * as React from 'react';
import { useEffect, useState } from 'react';
import { CloudIcon } from '../../ui/icons';
import { Spinner } from '../../ui/ui';

import { getRelease, CURRENT_RELEASE_ID } from './releases';

import DatasetIntro from './dataset-intro';
import DatasetCorpusDownload from './dataset-corpus-download';
import DatasetSegmentDownload from './dataset-segment-download';
import DatasetDescription from './dataset-description';
import { useAPI } from '../../../hooks/store-hooks';

import './dataset-info.css';
import { useLocale } from '../../locale-helpers';

const DatasetInfo = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [releaseId, setReleaseId] = useState(CURRENT_RELEASE_ID);
  const [releaseData, setReleaseData] = useState(null);
  const [languagesWithDatasets, setLanguagesWithDatasets] = useState([]);

  const api = useAPI();
  const [globalLocale] = useLocale();

  useEffect(() => {
    setIsLoading(true);
    getRelease(releaseId)
      .then(setReleaseData)
      .finally(() => {
        setIsLoading(false);
      });
  }, [releaseId]);

  useEffect(() => {
    setIsLoading(true);

    api.getLanguagesWithDatasets().then(data => {
      setLanguagesWithDatasets(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="dataset-info">
      <div className="top">
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
            languagesWithDatasets={languagesWithDatasets}
            initialLanguage={globalLocale}
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
