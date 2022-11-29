/* eslint-disable jsx-a11y/anchor-has-content */
import * as React from 'react';
import { useState } from 'react';
import { TextButton } from '../ui/ui';
import URLS from '../../urls';
import { trackGlobal } from '../../services/tracker';
import ContactModal from '../contact-modal/contact-modal';
import { useLocale, useLocalizedDiscourseURL } from '../locale-helpers';

interface SharedLinkProps {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  dispatch?: any;
  style?: any;
}

export const GitHubLink = ({ dispatch, ...props }: SharedLinkProps) => {
  const [locale] = useLocale();
  return (
    <a
      target="_blank"
      href={`${URLS.GITHUB_ROOT}`}
      rel="noopener noreferrer"
      onClick={() => trackGlobal('github', locale)}
      {...props}
    />
  );
};

export const DeltaReadMoreLink = ({
  dispatch,
  style,
  className,
  ...props
}: SharedLinkProps) => {
  const [locale] = useLocale();
  return (
    <a
      className={className}
      style={style}
      target="_blank"
      href={`${URLS.MOZILLA_BLOG_ROOT}/iterating-dataset-access-on-common-voice`}
      rel="noopener noreferrer"
      onClick={() => trackGlobal('blog', locale)}
      {...props}
    />
  );
};

export const DiscourseLink = ({ dispatch, ...props }: SharedLinkProps) => {
  const [locale] = useLocale();
  const discourseURL = useLocalizedDiscourseURL();
  return (
    <a
      target="blank"
      href={discourseURL}
      onClick={() => trackGlobal('discourse', locale)}
      {...props}
    />
  );
};

export const MatrixLink = ({ dispatch, ...props }: SharedLinkProps) => {
  const [locale] = useLocale();
  return (
    <a
      target="blank"
      href="https://chat.mozilla.org/#/room/#common-voice:mozilla.org"
      onClick={() => trackGlobal('matrix', locale)}
      {...props}
    />
  );
};

export const ContactLink = ({ dispatch, ...props }: SharedLinkProps) => {
  const [locale] = useLocale();
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
};
