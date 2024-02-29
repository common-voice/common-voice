import React from 'react'
import { Localized } from '@fluent/react'

import Page from '../../ui/page'
import PageHeading from '../../ui/page-heading'

import PageTextContent from '../../ui/page-text-content'
import RoundButton from '../../ui/round-button'
import {
  DiscourseLink,
  EmailLink,
  GitHubLink,
  MatrixLink,
} from '../../shared/links'
import VisuallyHidden from '../../visually-hidden/visually-hidden'
import { DiscourseIconCode, GithubIconCode, MatrixIcon } from '../../ui/icons'
import { LocaleLink } from '../../locale-helpers'
import URLS from '../../../urls'

import './sentence-collector-redirect.css'

const SentenceCollectorRedirect = () => (
  <Page className="sc-redirect-page">
    <div className="sc-redirect-page-wrapper">
      <div className="sc-redirect-page__content">
        <PageHeading>
          <Localized id="sc-redirect-page-title" />
        </PageHeading>

        <PageTextContent>
          <React.Fragment>
            <Localized
              id="sc-redirect-page-subtitle-1"
              elems={{
                writeURL: <LocaleLink to={URLS.WRITE} />,
                reviewURL: <LocaleLink to={URLS.REVIEW} />,
              }}>
              <p className="subtitle-1" />
            </Localized>
            <Localized
              id="sc-redirect-page-subtitle-2"
              elems={{
                matrixLink: <MatrixLink />,
                githubLink: <GitHubLink />,
                discourseLink: <DiscourseLink />,
                emailLink: <EmailLink />,
              }}>
              <p />
            </Localized>
            <div className="sc-redirect-page__buttons">
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
        </PageTextContent>
      </div>
      <div className="sc-redirect-page__image">
        <img
          src={require('./images/common-voice-mars-neutral.png')}
          alt=""
          loading="lazy"
          role="presentation"
        />
      </div>
    </div>
  </Page>
)

export default SentenceCollectorRedirect
