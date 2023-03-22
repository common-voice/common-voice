import { Localized } from '@fluent/react';
import React from 'react';

export const Rules = () => (
  <div className="rules">
    <div className="inner">
      <Localized id="what-can-i-add">
        <p />
      </Localized>
      <ul>
        <Localized
          id="new-sentence-rule-1"
          elems={{
            noCopyright: (
              <a
                href="https://en.wikipedia.org/wiki/Public_domain"
                target="_blank"
                rel="noreferrer"
              />
            ),
            cc0: (
              <a
                href="https://creativecommons.org/share-your-work/public-domain/cc0/"
                target="_blank"
                rel="noreferrer"
              />
            ),
          }}>
          <li />
        </Localized>
        <Localized id="new-sentence-rule-2">
          <li />
        </Localized>
        <Localized id="new-sentence-rule-3">
          <li />
        </Localized>
        <Localized id="new-sentence-rule-4">
          <li />
        </Localized>
        <Localized id="new-sentence-rule-5">
          <li />
        </Localized>
        <Localized id="new-sentence-rule-6">
          <li />
        </Localized>
        <Localized id="new-sentence-rule-7">
          <li />
        </Localized>
        <Localized id="new-sentence-rule-8">
          <li className="last-rule" />
        </Localized>
      </ul>
    </div>
  </div>
);
