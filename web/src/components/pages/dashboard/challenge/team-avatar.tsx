import * as React from 'react';
import { Avatar } from '../../../ui/ui';
import { ChallengeTeamToken } from 'common';
import { challengeLogos } from './constants';

export default ({ team }: { team: ChallengeTeamToken }) => {
  const logo = challengeLogos[team];
  if (!logo) return null;
  const { url, background, border } = logo;
  return (
    <Avatar
      className="team"
      url={url}
      style={{
        background,
        boxSizing: 'border-box',
        padding: '5px',
        ...(border && {
          border: '2px solid var(--grey)',
        }),
      }}
    />
  );
};
