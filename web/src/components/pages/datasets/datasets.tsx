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
          <h1>Developing Voice Tech in the Open</h1>
          <p>
            At Mozilla we believe that collaboration is key to unlocking the
            full potential of voice technology, one that includes everyone;
            every language and for every use case.
            <br />
            <br />
            <b>
              Because you’re here, we’re certain that you’re an important
              collaborator to learn from!
            </b>
            <br />
            <br />
            We would be very grateful if you could take this short survey to
            help Mozilla understand how you envision, and are building for the
            future of voice voice with open data and technologies.
            <br />
            <br />
            In late October, research findings will be shared back with you, and
            others in the voice ecosystem who have participated via our{' '}
            <a
              href="https://discourse.mozilla.org/c/voice"
              target="_blank"
              rel="noopener noreferrer">
              Discourse forum
            </a>
            .
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
