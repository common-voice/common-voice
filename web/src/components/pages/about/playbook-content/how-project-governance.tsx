import * as React from 'react';
import { Localized } from '@fluent/react';
import { LocaleNavLink } from '../../../locale-helpers';
import URLS from '../../../../urls';
import { PLAYBOOK } from '../constants';

const HowAddLanguage = React.memo(() => {
  const strong = <strong />;

  return (
    <>
      <Localized id="about-playbook-how-project-governance-content-1">
        <p />
      </Localized>
      <Localized id="about-playbook-how-project-governance-content-2">
        <p />
      </Localized>
      <strong>
        <Localized id="about-playbook-how-project-governance-content-3">
          <p />
        </Localized>
      </strong>
      <strong>
        <Localized id="about-playbook-how-project-governance-content-4">
          <p />
        </Localized>
      </strong>
      <strong>
        <Localized id="about-playbook-how-project-governance-content-5">
          <p />
        </Localized>
      </strong>
      <strong>
        <Localized id="about-playbook-how-project-governance-content-6">
          <p />
        </Localized>
      </strong>
      <a
        href="https://docs.google.com/document/d/1QHDhdJzBQzWRzjw88Br674OINtok09znq0vmpgVBZQo/edit#"
        target="_blank"
        rel="noopener noreferer">
        <Localized id="about-playbook-how-project-governance-content-7">
          <p />
        </Localized>
      </a>
    </>
  );
});

export default HowAddLanguage;
