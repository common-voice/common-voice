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

interface Props {
  children?: React.ReactNode;
  errorCode: '404' | '503' | '500';
  prevPath?: string;
}

const ErrorPage = ({ children, errorCode, prevPath }: Props) => {
  useEffect(() => {
    trackError(errorCode, prevPath || '');
  }, []);

  const headingLocalisationId =
    errorCode === '500'
      ? 'error-something-went-wrong'
      : `error-title-${errorCode}`;

  return (
    <Page className="error-page">
      <div className="error-page-wrapper">
        <div className="error-page__content">
          <PageHeading>
            <Localized id={headingLocalisationId} />
          </PageHeading>

          <PageTextContent>
            <h2>
              <Localized id="error-code" vars={{ code: errorCode }} />
            </h2>
            {children || (
              <React.Fragment>
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
              </React.Fragment>
            )}
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
