import * as React from 'react';
import { Localized } from '@fluent/react';

const HowGrowLanguage = React.memo(() => {
  const strong = <strong />;

  return (
    <>
      <Localized id="about-playbook-how-grow-language-content-1">
        <p />
      </Localized>
      <p className="tab-subtitle">
        <Localized id="about-playbook-how-grow-language-content-2">
          <strong />
        </Localized>
      </p>
      <Localized
        id="about-playbook-how-grow-language-content-3"
        elems={{
          eventTemplate: (
            <a
              href="https://drive.google.com/drive/folders/15eh2FIlgDZSQgnWGt3JDqKMA1fWRpdnP?usp=sharing"
              target="_blank"
              rel="noopener noreferer"
            />
          ),
        }}>
        <p />
      </Localized>
      <p className="tab-subtitle">
        <Localized id="about-playbook-how-grow-language-content-4">
          <strong />
        </Localized>
      </p>
      <Localized
        id="about-playbook-how-grow-language-content-5"
        elems={{
          campaignLink: (
            <a
              href="https://github.com/common-voice/community-playbook/blob/master/assets/img/CV_Social_Media_Community_Campaign.pdf"
              target="_blank"
              rel="noopener noreferer"
            />
          ),
        }}>
        <p />
      </Localized>
      <p className="tab-subtitle">
        <Localized id="about-playbook-how-grow-language-content-6">
          <strong />
        </Localized>
      </p>
      <Localized
        id="about-playbook-how-grow-language-content-7"
        elems={{
          outreachTemplates: (
            <a
              href="https://docs.google.com/document/d/19GcvuMfxtmV5V3ZXCYfQoqNl5-hFdi-mTmFjVW6TVho/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferer"
            />
          ),
        }}>
        <p />
      </Localized>
      <Localized
        id="about-playbook-how-grow-language-content-8"
        elems={{ strong }}>
        <p />
      </Localized>
    </>
  );
});

export default HowGrowLanguage;
