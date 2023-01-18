import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Spinner } from '../../ui/ui';

import DatasetIntro from './dataset-intro';
import DatasetCorpusDownload from './dataset-corpus-download';
import DatasetSegmentDownload from './dataset-segment-download';
import { useAPI } from '../../../hooks/store-hooks';
import StateTree from '../../../stores/tree';

import { useLocale } from '../../locale-helpers';
import DatasetDescription from './dataset-description';
import { Dataset } from 'common';

import './dataset-info.css';

const DatasetInfo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [languagesWithDatasets, setLanguagesWithDatasets] = useState([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset>();

  const api = useAPI();
  const [globalLocale] = useLocale();

  useEffect(() => {
    setIsLoading(true);

    //get all languages w/ dataset releases
    api.getLanguagesWithDatasets().then(data => {
      setLanguagesWithDatasets(data);
    });

    //get stats for latest full release
    api.getDatasets('complete').then(data => {
      setCurrentDataset(data[0]);
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
            languagesWithDatasets={languagesWithDatasets}
            initialLanguage={globalLocale}
          />
        )}
      </div>

      {isLoading ? (
        <Spinner isFloating={false} />
      ) : (
        <DatasetDescription releaseData={currentDataset} />
      )}

      <DatasetSegmentDownload />
    </div>
  );
};

export default DatasetInfo;
