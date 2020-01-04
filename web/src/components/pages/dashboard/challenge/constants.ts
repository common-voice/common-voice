import { ChallengeDuration, ChallengeTeamToken } from 'common/challenge';
import { UserClient } from 'common/user-clients';

export const challengeLogos: {
  [key in ChallengeTeamToken]: {
    background: string;
    border: boolean;
    url: string;
  };
} = {
  ibm: { background: '#fff', border: true, url: require('./images/ibm.svg') },
  lenovo: {
    background: '#fff',
    border: true,
    url: require('./images/lenovo.svg'),
  },
  mozilla: {
    background: '#000',
    border: false,
    url: require('./images/mozilla.svg'),
  },
  sap: { background: '#fff', border: true, url: require('./images/sap.svg') },
};

const isValidDate = (dateStr: string) => {
  const dateObj = new Date(dateStr);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

const getNow = () => {
  const dateParam =
    location.search && location.search.match(/date=(\d+-\d+-\d+)/);
  const date = dateParam && dateParam[1];
  return date && isValidDate(date) ? new Date(date) : new Date();
};

export const isChallengeLive = (challenge: ChallengeDuration) => {
  const now = getNow();
  return now >= challenge.start && now < challenge.end;
};

export const isBeforeChallenge = (challenge: ChallengeDuration) => {
  const now = getNow();
  return now < challenge.start;
};

export const pilotDates: ChallengeDuration = {
  start: new Date('2019-11-19'),
  end: new Date('2019-12-10'),
};

export const isEnrolled = (account: UserClient) =>
  account && account.enrollment && account.enrollment.challenge;

export const weeklyChallengeCopy = [
  {
    title: 'Sign up and Contribute',
    subtitle: 'Win a prize by being the team with the highest sign up rate',
    explanation:
      'This is the percentage of team invites that have been accepted out of the current total sent.',
  },
  {
    title: "Let's get social",
    subtitle: 'The most socially active team wins the prize',
    explanation:
      'This is the number of invites your team has sent inviting others to join the Open Voice Challenge',
  },
  {
    title: 'Top the Leaderboard',
    subtitle:
      'The team that validates the highest percentage of voice clips wins the prize',
    explanation:
      'This is the percentage of clips the team has accurately validated',
  },
];

export const FINAL_CHALLENGE_WEEK = weeklyChallengeCopy.length - 1;
