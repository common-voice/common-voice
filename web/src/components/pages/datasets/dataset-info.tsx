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
  // null = panel hidden; only set when the user clicks a full-release row.
  const [panelDataset, setPanelDataset] = useState<Dataset | null>(null);

  const api = useAPI();
  const [globalLocale] = useLocale();

  useEffect(() => {
    // Both fetches must resolve before render; otherwise `initialLanguage`
    // sees an empty list and falls back to `'en'`.
    Promise.all([
      api.getLanguagesWithDatasets(),
      api.getDatasets('complete') as Promise<Dataset[]>,
    ]).then(
      ([languagesData, datasetsData]) => {
        setLanguagesWithDatasets(languagesData);
        setAllDatasets(datasetsData);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
  }, []);

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
            onSelectDataset={({ dataset_id }) => {
              // Delta or unknown row → hide panel.
              const fullMatch = allDatasets.find(d => d.id === dataset_id);
              setPanelDataset(fullMatch ?? null);
            }}
          />
        )}
      </div>

      {!isLoading && panelDataset && (
        <DatasetDescription releaseData={panelDataset} />
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
