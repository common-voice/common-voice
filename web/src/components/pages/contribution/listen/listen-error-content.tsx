import * as React from 'react';
import { Localized } from '@fluent/react';

import { MicIcon } from '../../../ui/icons';
import { LinkButton } from '../../../ui/ui';
import URLS from '../../../../urls';

const MissingClips = ({ isDemoMode }: { isDemoMode: boolean }) => (
  <div className="empty-container">
    <div className="error-card">
      <h1>
        <Localized id="listen-empty-state" />
      </h1>
      <LinkButton
        rounded
        to={isDemoMode ? URLS.DEMO_SPEAK : URLS.SPEAK}
        className="record-instead">
        <MicIcon />{' '}
        <Localized id="record-button-label">
          <span />
        </Localized>
      </LinkButton>
    </div>
  </div>
);

const MissingClipsForVariant = () => (
  <div className="empty-container">
    <div className="error-card">
      <h1>
        <Localized id="listen-empty-state-variants" />
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
        <Localized id="listen-loading-error" />
      </p>
    </div>
  </div>
);

interface Props {
  isLoading: boolean;
  hasLoadingError: boolean;
  isMissingClips: boolean;
  isDemoMode: boolean;
  isMissingClipsForVariant: boolean;
}

const ListenErrorContent = ({
  isLoading,
  hasLoadingError,
  isMissingClips,
  isMissingClipsForVariant,
  isDemoMode,
}: Props) => {
  if (isLoading) {
    return null;
  }

  if (hasLoadingError) {
    return <LoadingError />;
  }

  if (isMissingClipsForVariant) {
    return <MissingClipsForVariant />;
  }

  if (isMissingClips) {
    return <MissingClips isDemoMode={isDemoMode} />;
  }

  return null;
};

export default ListenErrorContent;
