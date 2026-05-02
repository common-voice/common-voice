import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Spinner } from '../../ui/ui';

import DatasetIntro from './dataset-intro';
import DatasetCorpusDownload from './dataset-corpus-download';
import DatasetSegmentDownload from './dataset-segment-download';
import { DonateBanner } from '../../donate-banner';
import { useAPI } from '../../../hooks/store-hooks';
import StateTree from '../../../stores/tree';

import { useLocale } from '../../locale-helpers';
import DatasetDescription from './dataset-description';
import { Dataset } from 'common';

import './dataset-info.css';

interface PropsFromState {
  isSubscribedToMailingList: boolean;
}

const DatasetInfo: React.FC<PropsFromState> = ({
  isSubscribedToMailingList,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [languagesWithDatasets, setLanguagesWithDatasets] = useState<
    { id: number; name: string }[]
  >([]);
  const [allDatasets, setAllDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number>();

  const api = useAPI();
  const [globalLocale] = useLocale();

  useEffect(() => {
    setIsLoading(true);

    //get all languages w/ dataset releases
    api.getLanguagesWithDatasets().then(data => {
      setLanguagesWithDatasets(data);
    });

    //get stats for every full release; the description panel reflects the
    //currently selected row in the corpus download table.
    api.getDatasets('complete').then((data: Dataset[]) => {
      setAllDatasets(data);
      setSelectedDatasetId(data[0]?.id);
      setIsLoading(false);
    });
  }, []);

  const currentDataset =
    allDatasets.find(d => d.id === selectedDatasetId) ?? allDatasets[0];

  const hasGlobalLocaleDataset = languagesWithDatasets.some(
    l => l.name === globalLocale
  );

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
            initialLanguage={hasGlobalLocaleDataset ? globalLocale : 'en'}
            isSubscribedToMailingList={isSubscribedToMailingList}
            onSelectDataset={datasetId => {
              // Only update the description panel when the row maps to a
              // full-release dataset; delta selections leave it on the most
              // recent full release.
              if (allDatasets.some(d => d.id === datasetId)) {
                setSelectedDatasetId(datasetId);
              }
            }}
          />
        )}
      </div>

      {isLoading ? (
        <Spinner isFloating={false} />
      ) : (
        <DatasetDescription releaseData={currentDataset} />
      )}

      <div className="donate-banner-wrapper">
        <DonateBanner />
      </div>

      <DatasetSegmentDownload
        isSubscribedToMailingList={isSubscribedToMailingList}
      />
    </div>
  );
};

export default connect<PropsFromState>(({ user }: StateTree) => ({
  isSubscribedToMailingList: user.isSubscribedToMailingList,
}))(DatasetInfo);
