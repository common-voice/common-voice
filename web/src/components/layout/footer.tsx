import * as React from 'react'
import { Localized } from '@fluent/react'
import { Link } from 'react-router-dom'
import { trackNav } from '../../services/tracker'
import URLS from '../../urls'
import ShareButtons from '../share-buttons/share-buttons'
import { TextButton } from '../ui/ui'
import { LocaleLink, useLocale } from '../locale-helpers'
import Logo from './logo'
import SubscribeNewsletter from './subscribe-newsletter'
import { ContactLink, GitHubLink } from '../shared/links'
import { ExternalLinkIcon } from '../ui/icons'

import './footer.css'

const LocalizedLocaleLink = ({
  id,
  to,
  dataTestId,
}: {
  id: string
  to: string
  dataTestId?: string
}) => {
  const [locale] = useLocale()
  return (
    <Localized id={id}>
      <LocaleLink
        to={to}
        onClick={() => trackNav(id, locale)}
        data-testid={dataTestId}
      />
    </Localized>
  )
}

const Footer = React.memo(() => {
  const [, toLocaleRoute] = useLocale()
  return (
    <footer>
      <div id="moz-links">
        <div className="divider-bottom" />
        <div className="links">
          <div>
            <ContactLink className="left-aligned">
              <Localized id="contact-us">
                <p />
              </Localized>
            </ContactLink>
            <LocalizedLocaleLink
              id="privacy"
              to={URLS.PRIVACY}
              dataTestId="privacy-link"
            />
            <LocalizedLocaleLink
              id="terms"
              to={URLS.TERMS}
              dataTestId="terms-link"
            />
            <Localized id="cookies">
              <a
                target="_blank"
                href="https://www.mozilla.org/en-US/privacy/websites/#cookies"
                rel="noopener noreferrer"
              />
            </Localized>
          </div>
          <div className="divider-vertical" />
          <div>
            <LocalizedLocaleLink id="about" to={URLS.ABOUT} />
            <GitHubLink>GitHub</GitHubLink>
            <Localized id="faq">
              <Link
                to={`${toLocaleRoute(
                  URLS.ABOUT
                )}?tab=what-is-language#playbook`}
              />
            </Localized>
            <Localized id="documentation">
              <Link to={toLocaleRoute(URLS.FAQ)} />
            </Localized>
            <Localized id="download">
              <a href={URLS.MDC_DATASETS} target="_blank" rel="noreferrer">
                <span />
                <ExternalLinkIcon />
              </a>
            </Localized>
          </div>
        </div>

        <div id="sharing">
          <Localized id="share-title">
            <span className="title" />
          </Localized>

          <div className="icons">
            <ShareButtons />
          </div>
        </div>

        <div id="email-subscription">
          <SubscribeNewsletter />
        </div>

        <Localized id="back-top">
          <TextButton
            className="back-top"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </Localized>
      </div>

      <div id="logo-license-text">
        <div className="logo-container">
          <Logo isReverse />
          <p className="license">
            <Localized
              id="content-license-text"
              elems={{
                licenseLink: (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.mozilla.org/en-US/foundation/licensing/website-content/"
                  />
                ),
              }}>
              <span />
            </Localized>
          </p>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
