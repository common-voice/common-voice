import React, { useState } from 'react';
import { guidelinesSections } from '../constants';

export type SidebarContentProps = {
  id: string;
  contentVisible: boolean;
  toggleSectionVisible: (id: string) => void;
};

const SidebarContent: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState(guidelinesSections);

  const handleToggleVisibleSection = (id: string) => {
    const newSections = visibleSections.map(section => {
      if (section.id === id) {
        return { ...section, visible: !section.visible };
      }
      return section;
    });

    setVisibleSections(newSections);
  };

  return (
    <>
      {visibleSections.map(section => (
        <section.component
          id={section.id}
          key={section.id}
          contentVisible={section.visible}
          toggleSectionVisible={() => handleToggleVisibleSection(section.id)}
        />
      ))}
    </>
  );
};

export default SidebarContent;
