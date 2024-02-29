import { FC } from 'react';

export type SidebarContentProps = {
  id: string;
  contentVisible: boolean;
  toggleVisibleSection: (id: string) => void;
  isMobileWidth: boolean;
};

export type GuidelinesSection = {
  id: string;
  component: FC<SidebarContentProps>;
  visible: boolean;
};
