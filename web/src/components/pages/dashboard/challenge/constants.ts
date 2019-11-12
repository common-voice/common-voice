import { ChallengeDuration, ChallengeTeamToken } from 'common/challenge';
const queryString = require('query-string');

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

const isValidDate = (dateObj: any) => {
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

const getChallengeDates = (): ChallengeDuration => {
  const params = queryString.parse(location.search);

  let defaultDates: ChallengeDuration = {
    start: new Date('2019-11-18'),
    end: new Date('2019-12-18'),
  };

  let challengeDates: ChallengeDuration = defaultDates;

  if (params.challenge_start && isValidDate(new Date(params.challenge_start))) {
    challengeDates.start = new Date(params.challenge_start);
  }

  if (params.challenge_end && isValidDate(new Date(params.challenge_end))) {
    challengeDates.end = new Date(params.challenge_end);
  }

  return challengeDates.end > challengeDates.start
    ? challengeDates
    : defaultDates;
};

export const pilotDates: ChallengeDuration = getChallengeDates();
