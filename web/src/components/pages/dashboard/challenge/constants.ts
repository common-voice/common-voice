import { ChallengeTeamToken } from 'common/challenge';

export const challengeLogos: {
  [key in ChallengeTeamToken]: {
    background: string;
    border: boolean;
    url: string;
  };
} = {
  ibm: { background: '#fff', border: true, url: require('./images/ibm.svg') },
  mozilla: {
    background: '#000',
    border: false,
    url: require('./images/mozilla.svg'),
  },
  sap: { background: '#fff', border: true, url: require('./images/sap.svg') },
};
