import * as React from 'react';
import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import URLS from '../urls';
import { LocaleLink } from './locale-helpers';
import Modal from './modal/modal';

const TermsModal = ({
  getString,
  onAgree,
  onDisagree,
}: { onAgree: () => any; onDisagree: () => any } & LocalizationProps) => (
  <Localized
    id="review-terms"
    termsLink={<LocaleLink to={URLS.TERMS} blank />}
    privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
    <Modal
      buttons={{
        [getString('terms-agree')]: onAgree,
        [getString('terms-disagree')]: onDisagree,
      }}
    />
  </Localized>
);
export default withLocalization(TermsModal);
