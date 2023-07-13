import * as React from 'react';
import { Localized } from '@fluent/react';
import { LocaleNavLink } from '../../../locale-helpers';
import URLS from '../../../../urls';

const HowAddLanguage = React.memo(() => {
  const strong = <strong />;

  return (
    <>
      <Localized id="about-playbook-how-validate-content-1" elems={{ strong }}>
        <p />
      </Localized>
      <Localized id="about-playbook-how-validate-content-2" elems={{ strong }}>
        <p />
      </Localized>
      <Localized
        id="about-playbook-how-validate-content-3"
        elems={{
          strong,
          accuracyLink: <LocaleNavLink to={URLS.GUIDELINES} />,
        }}>
        <p />
      </Localized>
      <Localized id="about-playbook-how-validate-content-4">
        <p />
      </Localized>
    </>
  );
});

export default HowAddLanguage;
