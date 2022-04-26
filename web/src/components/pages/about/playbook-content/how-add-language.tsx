import * as React from 'react';
import { Localized } from '@fluent/react';
import { LocaleNavLink } from '../../../locale-helpers';
import URLS from '../../../../urls';
import { PLAYBOOK } from '../constants';

/* eslint-disable jsx-a11y/anchor-has-content */
// The link elements in this component are injected with text

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HowAddLanguage = React.memo(({ getFragment }: { getFragment: any }) => (
  <>
    <Localized
      id="about-playbook-how-add-language-content-1"
      elems={{
        languageRequestLink: <LocaleNavLink to={URLS.LANGUAGE_REQUEST} />,
      }}>
      <p />
    </Localized>

    <h4>
      <Localized id="about-playbook-how-add-language-translating-heading" />
    </h4>

    <Localized
      id="about-playbook-how-add-language-translating-content-1"
      elems={{
        translateVideoLink: (
          <a
            href="https://drive.google.com/file/d/1YVyHUPaw2oiVdZZ7_pg607cIMq0YDMcw/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}>
      <p />
    </Localized>

    <Localized
      id="about-playbook-how-add-language-translating-content-2"
      elems={{
        pontoonLink: <a href="http://pontoon.mozilla.org/" />,
        pontoonRequestLink: <a href="https://pontoon.mozilla.org/teams/" />,
        githubRepoLink: (
          <a href="https://github.com/common-voice/common-voice/issues/new?assignees=&labels=&template=language_request.md&title=" />
        ),
        localizationFragment: getFragment(PLAYBOOK.HOW_LOCALIZE),
      }}>
      <p />
    </Localized>

    <h4>
      <Localized id="about-playbook-how-add-language-collecting-sentences-heading" />
    </h4>

    <Localized
      id="about-playbook-how-add-language-collecting-sentences-content-1"
      elems={{
        sentenceCollectorVideo: (
          <a href="https://drive.google.com/file/d/1d0Sjev-diNsYmCguIoh726vAf9LAXDps/view?usp=sharing" />
        ),
      }}>
      <p />
    </Localized>

    <Localized
      id="about-playbook-how-add-language-collecting-sentences-content-2"
      elems={{
        sentenceCollectorLinkAdd: (
          <a href="https://commonvoice.mozilla.org/sentence-collector/#/add" />
        ),
        bulkImportDocsLink: (
          <a href="https://common-voice.github.io/community-playbook/sub_pages/text.html" />
        ),
        licenseLink: (
          <a href="https://common-voice.github.io/community-playbook/sub_pages/cc0waiver_process.html" />
        ),
      }}>
      <p />
    </Localized>

    <Localized
      id="about-playbook-how-add-language-collecting-sentences-content-3"
      elems={{
        sentenceCollectorFragment: getFragment(PLAYBOOK.HOW_ADD_SENTENCES),
      }}>
      <p />
    </Localized>
  </>
));

HowAddLanguage.displayName = 'HowAddLanguage';

export default HowAddLanguage;
