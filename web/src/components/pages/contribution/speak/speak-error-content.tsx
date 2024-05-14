import * as React from 'react';
import { Localized } from '@fluent/react';
import URLS from '../../../../urls';

import {
  ArrowRight,
  FirefoxColor,
  ChromeColor,
  SafariColor,
} from '../../../ui/icons';
import { LinkButton } from '../../../ui/ui';
import { isIOS, isMobileSafari } from '../../../../utility';
import VisuallyHidden from '../../../visually-hidden/visually-hidden';

const UnsupportedInfo = () => (
  <div className="empty-container">
    <div className="error-card unsupported">
      {isIOS() && !isMobileSafari() ? (
        <>
          <h1>
            <Localized id="record-platform-not-supported-ios-non-safari" />
          </h1>
          <SafariColor />
        </>
      ) : (
        <>
          <h1>
            <Localized id="record-platform-not-supported" />
          </h1>
          <p className="desktop">
            <Localized id="record-platform-not-supported-desktop" />
          </p>
          <div>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.firefox.com/">
              <VisuallyHidden>Firefox</VisuallyHidden>
              <FirefoxColor />
            </a>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.google.com/chrome">
              <VisuallyHidden>Chrome</VisuallyHidden>
              <ChromeColor />
            </a>
          </div>
        </>
      )}
    </div>
  </div>
);

const NoSentencesAvailable = () => (
  <div className="empty-container">
    <div className="error-card no-sentences-available">
      <h1>
        <Localized id="speak-empty-state" />
      </h1>
      <LinkButton rounded to={URLS.WRITE}>
        <ArrowRight className="speak-sc-icon" />{' '}
        <Localized id="speak-empty-state-cta">
          <span />
        </Localized>
      </LinkButton>
    </div>
  </div>
);

const NoSentencesAvailableForVariant = () => (
  <div className="empty-container">
    <div className="error-card no-sentences-for-variants">
      <h1>
        <Localized id="speak-empty-state-variants" />
      </h1>
      <LinkButton rounded to={URLS.PROFILE_INFO} className="settings-btn">
        <Localized id="settings">
          <span />
        </Localized>
      </LinkButton>
    </div>
  </div>
);

const LoadingError = () => (
  <div className="empty-container">
    <div className="error-card">
      <h1>
        <Localized id="error-something-went-wrong" />
      </h1>
      <p>
        <Localized id="speak-loading-error" />
      </p>
    </div>
  </div>
);

interface Props {
  isLoading: boolean;
  hasLoadingError: boolean;
  isUnsupportedPlatform: boolean;
  isMissingClips: boolean;
  isMissingClipsForVariant: boolean;
}

const SpeakErrorContent = ({
  isLoading,
  hasLoadingError,
  isUnsupportedPlatform,
  isMissingClips,
  isMissingClipsForVariant,
}: Props) => {
  if (isLoading) {
    return null;
  }

  if (hasLoadingError) {
    return <LoadingError />;
  }

  if (isUnsupportedPlatform) {
    return <UnsupportedInfo />;
  }

  if (isMissingClipsForVariant) {
    return <NoSentencesAvailableForVariant />;
  }

  if (isMissingClips) {
    return <NoSentencesAvailable />;
  }

  return null;
};

export default SpeakErrorContent;
