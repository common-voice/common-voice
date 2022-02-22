import * as React from 'react';
import { useEffect } from 'react';
import { Localized } from '@fluent/react';

import { trackError } from '../../../services/tracker';
import { LocaleLink } from '../../locale-helpers';
import { GitHubLink, DiscourseLink, MatrixLink } from '../../shared/links';
import { GithubIconCode, DiscourseIconCode, MatrixIcon } from '../../ui/icons';

import RoundButton from '../../ui/round-button';
import Page from '../../ui/page';
import PageHeading from '../../ui/page-heading';
import PageTextContent from '../../ui/page-text-content';
import VisuallyHidden from '../../visually-hidden/visually-hidden';

import './error-page.css';

const ErrorPage = ({
  errorCode,
  prevPath = '',
}: {
  errorCode: '404' | '503';
  prevPath: string;
}) => {
  useEffect(() => {
    trackError(errorCode, prevPath);
  }, []);

  return (
    <Page className="error-page">
      <div className="error-page-wrapper">
        <div className="error-page__content">
          <PageHeading>
            <Localized id={`error-title-${errorCode}`} />
          </PageHeading>
          <PageTextContent>
            <h2>
              <Localized id="error-code" vars={{ code: errorCode }} />
            </h2>
            <Localized
              id={`error-content-${errorCode}`}
              elems={{
                homepageLink: <LocaleLink to="" />,
                matrixLink: <MatrixLink />,
                githubLink: <GitHubLink />,
                discourseLink: <DiscourseLink />,
              }}>
              <p />
            </Localized>
            <div className="error-page__buttons">
              <RoundButton>
                <DiscourseLink>
                  <VisuallyHidden>Discourse</VisuallyHidden>
                  <DiscourseIconCode />
                </DiscourseLink>
              </RoundButton>

              <RoundButton>
                <GitHubLink>
                  <VisuallyHidden>GitHub</VisuallyHidden>
                  <GithubIconCode />
                </GitHubLink>
              </RoundButton>

              <RoundButton>
                <MatrixLink>
                  <VisuallyHidden>Matrix</VisuallyHidden>
                  <MatrixIcon />
                </MatrixLink>
              </RoundButton>
            </div>
          </PageTextContent>
        </div>
        <div className="error-page__image">
          <img src={require('./images/mars-sad.svg')} alt="" loading="lazy" />
        </div>
      </div>
    </Page>
  );
};

export default ErrorPage;
