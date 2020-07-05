import * as React from 'react';
import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react/compat';
import URLS from '../urls';
import { LocaleLink } from './locale-helpers';
import Modal from './modal/modal';

const TermsModal = ({
  getString,
  onAgree,
  onDisagree,
}: { onAgree: () => any; onDisagree: () => any } & WithLocalizationProps) => (
  <Localized
    id="review-terms"
    elems={{
      termsLink: <LocaleLink to={URLS.TERMS} blank />,
      privacyLink: <LocaleLink to={URLS.PRIVACY} blank />
    }}>
    <Modal
      buttons={{
        [getString('terms-agree')]: onAgree,
        [getString('terms-disagree')]: onDisagree,
      }}
    />
  </Localized>
);
export default withLocalization(TermsModal);
