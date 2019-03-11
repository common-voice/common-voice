import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { StyledLink } from '../ui/ui';
import URLS from '../../urls';
import { LocaleLink } from '../locale-helpers';
import { BENEFITS, WHATS_PUBLIC } from '../../constants';

function renderQA(content: any[]) {
  return content
    .map(c => (Array.isArray(c) ? c : [c, {}]))
    .map(([id, ...rest]) =>
      Array.isArray(id) ? [id, ...rest] : [[id, id], ...rest]
    )
    .map(([[qId, aId], props]) => (
      <React.Fragment key={qId}>
        <Localized id={'faq-' + qId + '-q'}>
          <h3 />
        </Localized>
        <Localized id={'faq-' + aId + '-a'} {...props}>
          <p />
        </Localized>
      </React.Fragment>
    ));
}

export default () => (
  <div id="faq-container">
    <Localized id="faq-title">
      <h2 />
    </Localized>

    {renderQA([
      'what-cv',
      'why-important',
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
          contactLink: (
            <StyledLink href="mailto:commonvoice@mozilla.com" blank />
          ),
        },
      ],
      'why-mission',
      'what-cv-and-deepspeech',
      'is-goal-assistant',
      'do-want-native',
      [
        'why-different-speakers',
        { articleLink: <StyledLink href="https://econ.st/2AVxVG3" blank /> },
      ],
      [
        ['why-my-lang', 'why-my-lang-new'],
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
      'why-not-ask-read',
    ])}

    {[['why-account', BENEFITS], ['is-account-public', WHATS_PUBLIC]].map(
      ([s, list]: any) => (
        <React.Fragment key={s}>
          <Localized id={'faq-' + s + '-q'}>
            <h3 />
          </Localized>
          <ul>
            {list.map((l: any) => (
              <Localized id={l}>
                <li />
              </Localized>
            ))}
          </ul>
        </React.Fragment>
      )
    )}

    {renderQA(['how-privacy', 'what-determine-identity'])}
    <br />

    <h2 id="glossary">
      <Localized id="glossary">
        <a href="#glossary" />
      </Localized>
    </h2>
    <br />

    {[
      'localization',
      'sentence-collection',
      'hours-recorded',
      'hours-validated',
      'sst',
      'de-identified',
    ].map(s => (
      <p key={s}>
        <a id={s} />
        <a href={'#' + s}>
          <Localized id={s}>
            <b />
          </Localized>
          <b>: </b>
        </a>
        <Localized id={s + '-explanation'}>
          <span />
        </Localized>
      </p>
    ))}
    <a
      href="https://voice.allizom.org"
      style={{ color: 'rgba(0, 0, 0, 0.05)' }}>
      Go to staging
    </a>
    <a href="https://localhost:9000" style={{ color: 'rgba(0, 0, 0, 0.05)' }}>
      Go to localhost
    </a>
  </div>
);
