import * as React from 'react';
import URLS from '../../../urls';
import { StyledLink } from '../../ui/ui';
import { LocaleLink } from '../../locale-helpers';
import { stringContains } from '../../../utility';
import { LocalizationProps } from 'fluent-react/compat';
import { BENEFITS, WHATS_PUBLIC } from '../../../constants';

const memoize = require('lodash.memoize');

export const SECTIONS: any = {
  whatIsCV: 'what-is-common-voice',
  usingCV: 'using-common-voice',
  glossary: 'glossary',
};

const SECTION_NAMES: any = {
  [SECTIONS.whatIsCV]: 'faq-what-cv-q',
  [SECTIONS.usingCV]: 'faq-using-cv',
  [SECTIONS.glossary]: 'glossary',
};

const SECTION_CONTENTS: any = {
  [SECTIONS.whatIsCV]: [
    'what-cv',
    'why-important',
    'why-mission',
    'what-cv-and-deepspeech',
    'is-goal-assistant',
  ],
  [SECTIONS.usingCV]: [
    [
      'how-get',
      {
        licenseLink: (
          <StyledLink
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            blank
          />
        ),
        datasetLink: <LocaleLink to={URLS.DATASETS} />,
      },
    ],
    [
      'when-release',
      {
        contactLink: <StyledLink href="mailto:commonvoice@mozilla.com" blank />,
      },
    ],
    'do-want-native',
    [
      'why-different-speakers',
      {
        articleLink: <StyledLink href="https://econ.st/2AVxVG3" blank />,
      },
    ],
    [
      ['faq-why-my-lang-q', ['faq-why-my-lang-new-a']],
      {
        multilangLink: (
          <StyledLink
            href="https://medium.com/mozilla-open-innovation/more-common-voices-24a80c879944"
            blank
          />
        ),
        sentenceCollectorLink: (
          <StyledLink
            href="https://common-voice.github.io/sentence-collector/"
            blank
          />
        ),
      },
    ],
    'what-quality',
    'why-10k-hours',
    'why-not-ask-read',
    'how-calc-hours',
    [
      'where-src-from-2',
      {
        italic: <i />,
        githubLink: (
          <StyledLink
            href="https://github.com/mozilla/voice-web/tree/master/server/data"
            blank
          />
        ),
      },
    ],
    [['faq-why-account-q', BENEFITS]],
    [['faq-is-account-public-q', WHATS_PUBLIC]],
    'how-privacy',
    'what-determine-identity',
  ],
  [SECTIONS.glossary]: [
    [['localization', 'localization-explanation']],
    [['sentence-collection', 'sentence-collection-explanation']],
    [['hours-recorded', 'hours-recorded-explanation']],
    [['hours-validated', 'hours-validated-explanation']],
    [['sst', 'sst-explanation']],
    [['de-identified', 'de-identified-explanation']],
  ],
};

export type FaqSection = {
  key: string;
  label: string;
  content: any[];
};

interface FaqSearchSelectorProps {
  searchString: string;
}

export const faqSearchSelector = memoize(
  ({
    getString,
    searchString,
  }: LocalizationProps & FaqSearchSelectorProps): FaqSection[] => {
    const search = searchString.toUpperCase();

    return Object.values(SECTIONS)
      .map((section: string) => {
        const content: any[] = (SECTION_CONTENTS[section] || []) as any[];

        return {
          key: section,
          label: SECTION_NAMES[section] || SECTIONS[section],
          content: content
            .map(c => (Array.isArray(c) ? c : [c, {}]))
            .map(([id, ...rest]) => {
              const params = rest.length === 0 ? [{}] : rest;

              return Array.isArray(id)
                ? Array.isArray(id[1])
                  ? [id, ...params]
                  : [[id[0], [id[1]]], ...params]
                : [['faq-' + id + '-q', ['faq-' + id + '-a']], ...params];
            })
            .filter(([[qId, aId], props]) => {
              if (search) {
                const answerFound = aId.reduce(
                  (carry: boolean, aId: string) =>
                    carry || stringContains(getString(aId, props), search),
                  false
                );

                if (!stringContains(getString(qId), search) && !answerFound) {
                  return null;
                }
              }

              return true;
            }),
        };
      })
      .filter((section: FaqSection) => section.content.length !== 0);
  },
  ({ searchString }: FaqSearchSelectorProps) => searchString.toUpperCase()
);
