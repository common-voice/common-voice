export type SidebarContentProps = {
  id: string;
  contentVisible: boolean;
  toggleVisibleSection: (id: string) => void;
  isMobileWidth: boolean;
};
