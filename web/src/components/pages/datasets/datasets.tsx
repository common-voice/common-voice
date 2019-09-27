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
      {locale == 'en' && surveyShown && (
        <div className="survey">
          <button onClick={hideSurvey}>
            <CloseIcon black />
          </button>
          <h1>Have thoughts about the future of voice technology?</h1>
          <p>
            Mozilla believes that collaboration is key to unlocking the full
            potential of this technology. A potential that includes everyone,
            every language and supports every use case.
            <br />
            <br />
            <b>
              Would you take a moment to provide your insights and take part in
              a survey?
            </b>
          </p>
          <a
            className="cta"
            href="https://qsurvey.mozilla.com/s3/Developing-Voice-Tech-in-the-Open?src=4"
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
