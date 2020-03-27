export type Newsletter = 'common-voice' | 'common-voice-datasets';
export type Subscriptions = Record<Newsletter, boolean>;
export const newsletters: Newsletter[] = [
  'common-voice',
  'common-voice-datasets',
];
export const emptySubscriptions: Subscriptions = newsletters.reduce(
  (acc, key) => ({
    ...acc,
    [key]: false,
  }),
  {} as Subscriptions
);
