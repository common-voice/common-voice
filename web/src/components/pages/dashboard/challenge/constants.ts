import { ChallengeDuration, ChallengeTeamToken } from 'common/challenge';

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

export const isChallengeLive = (challenge: ChallengeDuration) => {
  const now = new Date();
  return now >= challenge.start && now < challenge.end;
};

export const isBeforeChallenge = (challenge: ChallengeDuration) => {
  const now = new Date();
  return now < challenge.start;
};

export const pilotDates: ChallengeDuration = {
  start: new Date('2019-11-18'),
  end: new Date('2019-12-18'),
};
