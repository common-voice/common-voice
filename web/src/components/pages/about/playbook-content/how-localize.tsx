import * as React from 'react';
import { Localized } from '@fluent/react';
import { LinkButton } from '../../../ui/ui';
import { ArrowRight } from '../../../ui/icons';

const HowLocalize = React.memo(() => {
  const strong = <strong />;

  return (
    <>
      <Localized id="about-playbook-how-localize-content-1" elems={{ strong }}>
        <p />
      </Localized>
      <Localized
        id="about-playbook-how-localize-content-2"
        elems={{
          strong,
          pontoonAccountLink: (
            <a
              href="https://pontoon.mozilla.org/accounts/fxa/login/"
              target="_blank"
              rel="noopener noreferer"
            />
          ),
          pontoonCvLink: (
            <a
              href="https://pontoon.mozilla.org/projects/common-voice/"
              target="_blank"
              rel="noopener noreferer"
            />
          ),
        }}>
        <p />
      </Localized>
      <Localized id="about-playbook-how-localize-content-3" elems={{ strong }}>
        <p />
      </Localized>
      <Localized id="about-playbook-how-localize-content-4">
        <p />
      </Localized>
      <LinkButton
        rounded
        blank
        href="https://drive.google.com/file/d/1YVyHUPaw2oiVdZZ7_pg607cIMq0YDMcw/view?usp=sharing">
        <Localized id="about-playbook-how-localize-content-5" />
        <ArrowRight />
      </LinkButton>
    </>
  );
});

export default HowLocalize;
