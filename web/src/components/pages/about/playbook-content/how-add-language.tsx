import * as React from 'react';
import { Localized } from '@fluent/react';
import { LocaleNavLink } from '../../../locale-helpers';
import URLS from '../../../../urls';
import { SECTIONS, PLAYBOOK } from '../constants';

const HowAddLanguage = React.memo(
  ({ getFragment, ...props }: { getFragment: any }) => {
    const strong = <strong />;

    return (
      <>
        <Localized
          id="about-playbook-how-add-language-content-1"
          elems={{
            strong,
            languageLink: <LocaleNavLink to={URLS.LANGUAGES} />,
          }}>
          <p />
        </Localized>
        <Localized
          id="about-playbook-how-add-language-content-2"
          elems={{
            strong,
            translateVideo: (
              <a
                href="https://drive.google.com/file/d/1YVyHUPaw2oiVdZZ7_pg607cIMq0YDMcw/view?usp=sharing"
                target="_blank"
                rel="noopener noreferer"
              />
            ),
            pontoonLink: (
              <a
                href="http://pontoon.mozilla.org/"
                target="_blank"
                rel="noopener noreferer"
              />
            ),
            pontoonRequestLink: (
              <a
                href="https://pontoon.mozilla.org/teams/"
                target="_blank"
                rel="noopener noreferer"
              />
            ),
            repoLink: (
              <a
                href="https://github.com/common-voice/common-voice/issues/new?assignees=&labels=&template=language_request.md&title="
                target="_blank"
                rel="noopener noreferer"
              />
            ),
            localizationFragment: getFragment(PLAYBOOK.HOW_LOCALIZE),
          }}>
          <p />
        </Localized>
        <Localized
          id="about-playbook-how-add-language-content-3"
          elems={{
            strong,
            scVideo: (
              <a
                href="https://drive.google.com/file/d/1d0Sjev-diNsYmCguIoh726vAf9LAXDps/view?usp=sharing"
                target="_blank"
                rel="noopener noreferer"
              />
            ),
            scFragment: getFragment(PLAYBOOK.HOW_ADD_SENTENCES),
          }}>
          <p />
        </Localized>
        <Localized
          id="about-playbook-how-add-language-content-4"
          elems={{
            scLink: (
              <a
                href="https://commonvoice.mozilla.org/sentence-collector/"
                target="_blank"
                rel="noopener noreferer"
              />
            ),
            scLinkAdd: (
              <a
                href="https://commonvoice.mozilla.org/sentence-collector/#/add"
                target="_blank"
                rel="noopener noreferer"
              />
            ),
            bulkImportDocsLink: (
              <a
                href="https://common-voice.github.io/community-playbook/sub_pages/text.html"
                target="_blank"
                rel="noopener noreferer"
              />
            ),
            licenseLink: (
              <a
                href="https://common-voice.github.io/community-playbook/sub_pages/cc0waiver_process.html"
                target="_blank"
                rel="noopener noreferer"
              />
            ),
            scFragment: getFragment(PLAYBOOK.HOW_ADD_SENTENCES),
          }}>
          <p />
        </Localized>
      </>
    );
  }
);

export default HowAddLanguage;
