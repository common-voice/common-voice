import { Localized } from '@fluent/react';
import React from 'react';
import ExampleContentSentence from './example-content-sentence';

export const ReviewingSentences = () => {
  return (
    <div className="sidebar-content">
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="reviewing-sentences">
          <h3 className="guidelines-content-heading" />
        </Localized>
      </div>
      <div className="content-wrapper">
        <ul>
          <Localized id="reviewing-sentences-explanation-1">
            <li />
          </Localized>
          <Localized id="reviewing-sentences-explanation-2">
            <li />
          </Localized>
          <Localized id="reviewing-sentences-explanation-3">
            <li />
          </Localized>
          <Localized id="reviewing-sentences-explanation-4">
            <li />
          </Localized>
        </ul>
        <div>
          <Localized id="example">
            <p className="example" />
          </Localized>
          <ExampleContentSentence contentType="review" />
        </div>
      </div>
    </div>
  );
};
