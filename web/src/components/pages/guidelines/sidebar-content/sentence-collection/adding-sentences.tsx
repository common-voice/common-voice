import { Localized } from '@fluent/react';
import classNames from 'classnames';
import React from 'react';

import { ChevronDown } from '../../../../ui/icons';
import { TextButton } from '../../../../ui/ui';
import { SidebarContentProps } from '../../types';

export const AddingSentences: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
}) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="adding-sentences">
          <TextButton
            onClick={toggleVisibleSection}
            className="guidelines-content-heading"
          />
        </Localized>
        <ChevronDown
          onClick={toggleVisibleSection}
          className={classNames('chevron', { 'rotate-180': contentVisible })}
        />
      </div>
      {contentVisible && (
        <div className="content-wrapper">
          <Localized id="adding-sentences-subheader-length">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="adding-sentences-subheader-length-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="adding-sentences-subheader-spelling-punctuation">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="adding-sentences-subheader-spelling-punctuation-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="adding-sentences-subheader-speakable">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="adding-sentences-subheader-speakable-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="adding-sentences-subheader-numbers">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="adding-sentences-subheader-numbers-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="adding-sentences-subheader-abbreviations">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="adding-sentences-subheader-abbreviations-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="adding-sentences-subheader-special-characters">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="adding-sentences-subheader-special-characters-explanation-1">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="adding-sentences-subheader-special-characters-explanation-2">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="adding-sentences-subheader-offensive-content">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="adding-sentences-subheader-offensive-content-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <span className="border" />
        </div>
      )}
    </div>
  );
};
