import * as React from 'react';
import { Localized } from '@fluent/react';

import { StyledLink } from '../../../ui/ui';
import Page from '../../../ui/page';
import PageTextContent from '../../../ui/page-text-content';
import PageHeading from '../../../ui/page-heading';

import './request.css';

const EMAIL_ADDRESS = 'commonvoice@mozilla.com';

const LanguagesRequestSuccessPage = () => {
  return (
    <Page className="languages-request-page languages-request-page--success">
      <div className="languages-request-page-wrapper">
        <div className="languages-request-page__content">
          <PageHeading>
            <Localized id="request-language-success-heading" />
          </PageHeading>

          <PageTextContent>
            <ul>
              <li>
                <Localized id="request-language-success-list-1" />
              </li>
              <li>
                <Localized id="request-language-success-list-2" />
              </li>

              <Localized
                id="request-language-success-list-3"
                elems={{
                  emailLink: <StyledLink href={`mailto:${EMAIL_ADDRESS}`} />,
                }}
                vars={{ email: EMAIL_ADDRESS }}>
                <li />
              </Localized>
            </ul>
          </PageTextContent>
        </div>

        <div className="languages-request-page__image">
          <img
            src={require('./images/mars-email-success.svg')}
            alt=""
            loading="lazy"
          />
        </div>
      </div>
    </Page>
  );
};

export default LanguagesRequestSuccessPage;
