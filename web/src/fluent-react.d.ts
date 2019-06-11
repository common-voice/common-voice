declare module 'fluent-react/compat' {
  import * as React from 'react';
  import { Omit } from 'react-router';
  export function Localized(
    ...args: any[]
  ): React.ReactElement<
    {
      id: string;
      [key: string]: any;
    },
    any
  >;

  export interface LocalizationProps {
    getString(
      id: string,
      args?: { [key: string]: string | number },
      fallback?: string
    ): string;
  }

  export function withLocalization<P extends LocalizationProps>(
    component: React.ComponentType<P>
  ): React.ComponentClass<Omit<P, keyof LocalizationProps>>;
}
