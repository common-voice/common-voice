import { Localized } from '@fluent/react';
import React from 'react';

import ExampleContentSentence from './example-content-sentence';

export const CitingSentences = () => {
  return (
    <div className="sidebar-content">
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="citing-sentences">
          <h3 className="guidelines-content-heading" />
        </Localized>
      </div>
      <div className="content-wrapper">
        <Localized id="citing-sentences-explanation-1">
          <p className="guidelines-content-explanation" />
        </Localized>
        <Localized id="citing-sentences-subheader-websites">
          <p className="guidelines-content-explanation header" />
        </Localized>
        <Localized id="citing-sentences-subheader-websites-explanation">
          <p className="guidelines-content-explanation" />
        </Localized>
        <Localized id="citing-sentences-subheader-academic-reference">
          <p className="guidelines-content-explanation header" />
        </Localized>
        <Localized id="citing-sentences-subheader-academic-reference-explanation">
          <p className="guidelines-content-explanation" />
        </Localized>
        <Localized id="citing-sentences-subheader-offline-sources">
          <p className="guidelines-content-explanation header" />
        </Localized>
        <Localized id="citing-sentences-subheader-offline-sources-explanation">
          <p className="guidelines-content-explanation" />
        </Localized>
        <div>
          <Localized id="example">
            <p className="example" />
          </Localized>
          <ExampleContentSentence contentType="cite" />
        </div>
        <span className="border" />
      </div>
    </div>
  );
};
