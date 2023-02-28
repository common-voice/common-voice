import { Localized } from '@fluent/react';
import React from 'react';

export const PublicDomain = () => {
  return (
    <div className="sidebar-content">
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="public-domain">
          <h3 className="guidelines-content-heading" />
        </Localized>
      </div>
      <div className="content-wrapper">
        <Localized id="public-domain-explanation-1">
          <p className="guidelines-content-explanation" />
        </Localized>
        <Localized id="public-domain-explanation-2">
          <p className="guidelines-content-explanation" />
        </Localized>
        <ul>
          <Localized id="public-domain-explanation-3">
            <li />
          </Localized>
          <Localized id="public-domain-explanation-4">
            <li />
          </Localized>
          <Localized id="public-domain-explanation-5">
            <li />
          </Localized>
          <Localized id="public-domain-explanation-6">
            <li />
          </Localized>
        </ul>
        <span className="border" />
      </div>
    </div>
  );
};
