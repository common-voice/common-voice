import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { LocalizedGetAttribute } from '../../locale-helpers';
import { LEGACY_ACCENTS as ACCENTS, AGES } from '../../../stores/demographics';
import { BundleState, ReleaseData } from './types';

const DEFAULT_CATEGORY_COUNT = 2;

const Splits = ({
  category,
  values,
  bundleLocale,
}: {
  category: string;
  values: { [key: string]: number };
  bundleLocale: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const categories = Object.entries(values).filter(
    ([key, value]) => key && key != 'other' && value > 0
  );
  return (
    <div key={category} className="splits">
      <LocalizedGetAttribute id={'profile-form-' + category} attribute="label">
        {label => <h5>{label}</h5>}
      </LocalizedGetAttribute>

      <ol onClick={() => setExpanded(!expanded)} tabIndex={0} role="button">
        {categories
          .sort((a, b) => (a[1] < b[1] ? 1 : -1))
          .slice(0, expanded ? categories.length : DEFAULT_CATEGORY_COUNT)
          .map(([key, value]) => (
            <li key={key}>
              <b>{Math.round(value * 100)}%</b>
              <span> </span>
              <div className="ellipsis">
                {category == 'gender' ? (
                  <Localized id={key}>
                    <span />
                  </Localized>
                ) : category == 'accent' ? (
                  ACCENTS[bundleLocale] ? (
                    ACCENTS[bundleLocale][key]
                  ) : (
                    key
                  )
                ) : category == 'age' ? (
                  (AGES as { [key: string]: string })[key]
                ) : (
                  key
                )}
              </div>
            </li>
          ))}
        {!expanded && categories.length > DEFAULT_CATEGORY_COUNT && (
          <li key="more">...</li>
        )}
      </ol>
    </div>
  );
};

interface Props {
  releaseData: ReleaseData;
  bundleState: BundleState;
}

const DatasetCorpusDownloadStats = ({ releaseData, bundleState }: Props) => {
  const localeReleaseData = releaseData.locales[bundleState.bundleLocale];

  return (
    <React.Fragment>
      {Object.entries({
        'dataset-date': releaseData.date,
        size: bundleState.size,
        'dataset-version': (
          <div className="version">
            {[
              bundleState.bundleLocale,
              bundleState.totalHours + 'h',
              releaseData.date,
            ].join('_')}
          </div>
        ),
        'validated-hr-total': bundleState.validHours.toLocaleString(),
        'overall-hr-total': bundleState.totalHours.toLocaleString(),
        'cv-license': 'CC-0',
        'number-of-voices': localeReleaseData.users.toLocaleString(),
        'audio-format': 'MP3',
        splits: Object.entries(localeReleaseData.splits)
          .filter(([, values]) => Object.keys(values).length > 1)
          .map(([category, values]: [string, { [key: string]: number }]) => {
            return (
              <Splits
                key={category}
                {...{
                  category,
                  values,
                  bundleLocale: bundleState.bundleLocale,
                }}
              />
            );
          }),
      }).map(([id, value]) => (
        <li key={id}>
          <Localized id={id}>
            <span className="label" />
          </Localized>
          <span className="value">{value}</span>
        </li>
      ))}
    </React.Fragment>
  );
};

export default DatasetCorpusDownloadStats;
