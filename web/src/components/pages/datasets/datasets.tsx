import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useState } from 'react';
import URLS from '../../../urls';
import { LocaleLink, useLocale } from '../../locale-helpers';
import { CloseIcon, PlayOutlineIcon } from '../../ui/icons';
import DatasetInfo from './dataset-info';
import Subscribe from './subscribe';

import Resources from './resources';
import './datasets.css';

const SURVEY_KEY = 'showSurvey3';

export default () => {
  const [locale] = useLocale();
  const [surveyShown, setSurveyShown] = useState(false);

  function showSurvey() {
    setSurveyShown(JSON.parse(localStorage.getItem(SURVEY_KEY)) !== false);
  }

  function hideSurvey() {
    setSurveyShown(false);
    localStorage.setItem(SURVEY_KEY, JSON.stringify(false));
  }

  useEffect(() => {
    document.addEventListener('scroll', showSurvey);
    return () => {
      document.removeEventListener('scroll', showSurvey);
    };
  }, []);

  return (
    <div className="datasets-content">
      {locale === 'en' && surveyShown && (
        <div className="survey">
          <button onClick={hideSurvey}>
            <CloseIcon black />
          </button>
          <h1>Have thoughts about the future of voice technology?</h1>
          <p>
            The Common Voice dataset aims to empower developers to build great
            voice recognition applications. As the dataset grows we want to
            understand how it is working for our users.
          </p>
          <p>
            If you have downloaded the Common Voice dataset, please take some
            time to help us understand your needs, and how we can improve the
            dataset:
          </p>
          <p>
            <strong>
              Would you take a moment to provide your insights and take part in
              a survey?
            </strong>
          </p>
          <a
            className="cta"
            href="https://www.surveygizmo.com/s3/5472060/Common-Voice-Dataset-Quality?src=4"
            target="_blank"
            rel="noopener noreferrer"
            onClick={hideSurvey}>
            Go to survey
          </a>
        </div>
      )}
      <DatasetInfo />
      <Subscribe />
      <Resources />
      <div className="mars-validate">
        <div>
          <img src={require('./images/mars.svg')} alt="" />
        </div>
        <div>
          <div className="cta-container">
            <LocaleLink to={URLS.LISTEN}>
              <PlayOutlineIcon />
            </LocaleLink>
            <Localized id="ready-to-validate">
              <h3 />
            </Localized>
          </div>
        </div>
      </div>
    </div>
  );
};
