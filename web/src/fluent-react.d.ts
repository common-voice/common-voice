declare module 'fluent-react' {
  import * as React from 'react';
  import { Omit } from 'react-router';
  export function Localized(
    ...args: any[]
  ): React.Component<{
    id: string;
    [key: string]: any;
  }>;

  export interface LocalizationProps {
    getString(
      id: string,
      args?: { [key: string]: string },
      fallback?: string
    ): string;
  }

  export function withLocalization<P extends LocalizationProps>(
    component: React.ComponentType<P>
  ): React.ComponentClass<Omit<P, keyof LocalizationProps>>;
}
