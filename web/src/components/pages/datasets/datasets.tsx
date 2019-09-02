import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { isProduction } from '../../../utility';
import URLS from '../../../urls';
import { LocaleLink, useLocale } from '../../locale-helpers';
import { CloseIcon, PlayOutlineIcon } from '../../ui/icons';
import DatasetInfo from './dataset-info';
import Subscribe from './subscribe';

import Resources from './resources';
import './datasets.css';

const SURVEY_KEY = 'showSurvey2';

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
      {!isProduction() && locale == 'en' && surveyShown && (
        <div className="survey">
          <button onClick={hideSurvey}>
            <CloseIcon black />
          </button>
          <h1>Penny for your thoughts?</h1>
          <p>
            We would like to know how you plan on using the Common Voice dataset
            and if you have any ideas for improvement. Can you spare a few
            minutes to take a survey about the dataset?
          </p>
          <a
            href="https://www.surveygizmo.com/s3/4446677/3a21d4a69b6b"
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
