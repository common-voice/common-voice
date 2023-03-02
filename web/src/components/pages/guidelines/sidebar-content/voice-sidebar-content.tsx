import * as React from 'react';
import { voiceGuidelinesSections } from '../constants';
import { handleToggleVisibleSection } from '../utils';

const VoiceSidebarContent: React.FC = () => {
  const [visibleSections, setVisibleSections] = React.useState(
    voiceGuidelinesSections
  );

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
        />
      ))}
    </>
  );
};

export default VoiceSidebarContent;
