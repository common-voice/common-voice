import * as React from 'react';

import useIsMaxWindowWidth from '../../../../hooks/use-is-max-window-width';
import { sentenceGuidelineSections } from '../constants';
import { handleToggleVisibleSection } from '../utils';

const SentenceSidebarContent = () => {
  const [visibleSections, setVisibleSections] = React.useState(
    sentenceGuidelineSections
  );

  const isMobileWidth = useIsMaxWindowWidth();

  const onToggleVisibleSection = (id: string) => {
    handleToggleVisibleSection({ id, visibleSections, setVisibleSections });
  };

  return (
    <>
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
