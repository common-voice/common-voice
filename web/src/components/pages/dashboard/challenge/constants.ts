import { ChallengeDuration, ChallengeTeamToken } from 'common/challenge';

export const challengeLogoUrls: { [key in ChallengeTeamToken]: string } = {
  ibm: require('./images/ibm.svg'),
  mozilla: require('./images/mozilla.svg'),
  sap: require('./images/sap.svg'),
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
