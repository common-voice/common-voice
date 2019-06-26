import * as React from 'react';
import { useState } from 'react';
import { TextButton } from '../ui/ui';
import { trackGlobal } from '../../services/tracker';
import ContactModal from '../contact-modal/contact-modal';
import { useLocale, useLocalizedDiscourseURL } from '../locale-helpers';

interface SharedLinkProps {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  dispatch?: any;
}

export const GitHubLink = ({ dispatch, ...props }: SharedLinkProps) => {
  const [locale] = useLocale();
  return (
    <a
      target="_blank"
      href="https://www2.deloitte.com/is/is.html"
      onClick={() => trackGlobal('github', locale)}
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
      href="https://www.rannis.is/sjodir/menntun/nyskopunarsjodur-namsmanna/"
      onClick={() => trackGlobal('slack', locale)}
      {...props}
    />
  );
};

export const SlackLink = ({ dispatch, ...props }: SharedLinkProps) => {
  const [locale] = useLocale();
  return (
    <a
      target="blank"
      href="https://www.ru.is/skema//"
      onClick={() => trackGlobal('slack', locale)}
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
