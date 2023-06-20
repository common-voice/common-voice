import { SidebarContentProps } from './types';

type Section = {
  id: string;
  component: React.FC<SidebarContentProps>;
  visible: boolean;
};

export type handleToggleVisibleSectionParams = {
  visibleSections: Section[];
  setVisibleSections: React.Dispatch<React.SetStateAction<Section[]>>;
  id: string;
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
