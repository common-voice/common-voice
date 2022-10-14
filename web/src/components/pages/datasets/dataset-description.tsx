import * as React from 'react';
import { Localized } from '@fluent/react';
import { LocaleLink, useLocale } from '../../locale-helpers';
import CircleStats from './circle-stats';
import URLS from '../../../urls';

import './dataset-description.css';
import { Dataset } from 'common';
import { msToHours } from '../../../utility';

interface Props {
  releaseData: Dataset;
}

const DatasetDescription = ({ releaseData }: Props) => {
  const [locale] = useLocale();
  const languages = releaseData.languages_count;
  const globalReleaseData = {
    total: msToHours(releaseData.total_clips_duration).toLocaleString(locale),
    valid: msToHours(releaseData.valid_clips_duration).toLocaleString(locale),
    languages,
  };

  return (
    <div className="dataset-description">
      <CircleStats {...globalReleaseData} className="hidden-md-down" />
      <div className="text">
        <div className="line" />
        <h2 id="whats-inside">
          <Localized id="whats-inside" />
        </h2>
        <CircleStats {...globalReleaseData} className="hidden-lg-up" />
        <Localized
          id="dataset-description-hours"
          vars={globalReleaseData}
          elems={{
            b: <b />,
            languagesLink: <LocaleLink to={URLS.LANGUAGES}></LocaleLink>,
          }}>
          <p id="description-hours" />
        </Localized>
      </div>
    </div>
  );
};

export default DatasetDescription;
