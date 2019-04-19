import * as React from 'react';
import { useState } from 'react';
import { TextButton } from '../ui/ui';
import { trackGlobal } from '../../services/tracker';
import ContactModal from '../contact-modal/contact-modal';
import { LocalePropsFromState, localeConnector } from '../locale-helpers';

interface SharedLinkProps extends LocalePropsFromState {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  dispatch?: any;
}

export const GitHubLink = localeConnector(
  ({ locale, dispatch, toLocaleRoute, ...props }: SharedLinkProps) => {
    return (
      <a
        target="_blank"
        href="https://github.com/mozilla/voice-web"
        onClick={() => trackGlobal('github', locale)}
        {...props}
      />
    );
  }
);

export const DiscourseLink = localeConnector(
  ({ locale, dispatch, toLocaleRoute, ...props }: SharedLinkProps) => {
    return (
      <a
        target="blank"
        href="https://discourse.mozilla-community.org/c/voice"
        onClick={() => trackGlobal('discourse', locale)}
        {...props}
      />
    );
  }
);

export const SlackLink = localeConnector(
  ({ locale, dispatch, toLocaleRoute, ...props }: SharedLinkProps) => {
    return (
      <a
        target="blank"
        href="https://common-voice-slack-invite.herokuapp.com/"
        onClick={() => trackGlobal('slack', locale)}
        {...props}
      />
    );
  }
);

export const ContactLink = localeConnector(
  ({ locale, dispatch, toLocaleRoute, ...props }: SharedLinkProps) => {
    const [showContactModal, setShowContactModal] = useState(false);

    return (
      <>
        {showContactModal && (
          <ContactModal onRequestClose={() => setShowContactModal(false)} />
        )}

        <TextButton
          {...props}
          onClick={() => {
            trackGlobal('contact', locale);
            setShowContactModal(true);
          }}
        />
      </>
    );
  }
);
