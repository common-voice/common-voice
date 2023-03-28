import { Localized } from '@fluent/react';
import * as React from 'react';
import useIsMobileWidth from '../../../../hooks/use-is-mobile-width';

import { sentenceGuidelineSections } from '../constants';
import { handleToggleVisibleSection } from '../utils';

const SentenceSidebarContent = () => {
  const [visibleSections, setVisibleSections] = React.useState(
    sentenceGuidelineSections
  );

  const isMobileWidth = useIsMobileWidth();

  const onToggleVisibleSection = (id: string) => {
    handleToggleVisibleSection({ id, visibleSections, setVisibleSections });
  };

  return (
    <>
      <div className="announcements-container">
        <Localized id="community-announcement-header">
          <h2 className="announcements-header" />
        </Localized>
        <Localized
          id="community-announcement-explanation"
          elems={{
            scLink: (
              <a
                href="https://commonvoice.mozilla.org/sentence-collector/"
                target="_blank"
                rel="noreferrer"
                className="underlined-link"
              />
            ),
          }}>
          <p />
        </Localized>
      </div>
      {visibleSections.map(section => (
        <section.component
          id={section.id}
          key={section.id}
          contentVisible={section.visible}
          toggleVisibleSection={() => onToggleVisibleSection(section.id)}
          isMobileWidth={isMobileWidth}
        />
      ))}
    </>
  );
};

export default SentenceSidebarContent;
