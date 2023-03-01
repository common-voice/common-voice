import React, { useState } from 'react';
import { voiceGuidelinesSections } from '../constants';

export type handleToggleVisibleSectionParams = {
  visibleSections: typeof voiceGuidelinesSections;
  setVisibleSections: React.Dispatch<
    React.SetStateAction<typeof voiceGuidelinesSections>
  >;
  id: string;
};

export type SidebarContentProps = {
  id: string;
  contentVisible: boolean;
  toggleVisibleSection: (id: string) => void;
};

export const handleToggleVisibleSection = ({
  visibleSections,
  setVisibleSections,
  id,
}: handleToggleVisibleSectionParams) => {
  const newSections = visibleSections.map(section => {
    if (section.id === id) {
      return { ...section, visible: !section.visible };
    }
    return section;
  });

  setVisibleSections(newSections);
};

const VoiceSidebarContent: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState(
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
