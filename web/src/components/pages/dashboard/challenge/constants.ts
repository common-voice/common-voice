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

export const getWeekNum = (date: Date) => {
  // create new Date obj to avoid mutating input
  const now = new Date(date.getUTCFullYear(), date.getMonth(), date.getDate());
  now.setMilliseconds(0);

  const yearStart = new Date(now.getUTCFullYear(), 0, 1);
  const milisecsInWeek = 7 * 24 * 60 * 60 * 1000;

  return Math.floor((now.valueOf() - yearStart.valueOf()) / milisecsInWeek) + 1;
};

export const pilotDates: ChallengeDuration = {
  start: new Date('2019-11-18'),
  end: new Date('2019-12-18'),
};
