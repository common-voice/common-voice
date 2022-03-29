import * as React from 'react';
import { Localized } from '@fluent/react';
import { LocaleLink, useLocale } from '../../locale-helpers';
import CircleStats from './circle-stats';
import URLS from '../../../urls';
import { ReleaseData } from './types';

import './dataset-description.css';

interface Props {
  releaseData: ReleaseData;
}

const DatasetDescription = ({ releaseData }: Props) => {
  const [locale] = useLocale();
  const languages = Object.keys(releaseData.locales).length;
  const globalReleaseData = {
    total: releaseData.totalHrs.toLocaleString(locale),
    valid: releaseData.totalValidHrs.toLocaleString(locale),
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
