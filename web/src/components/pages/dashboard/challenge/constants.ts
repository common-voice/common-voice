import { ChallengeTeamToken } from 'common/challenge';

export const challengeLogoUrls: { [key in ChallengeTeamToken]: string } = {
  ibm: require('./images/ibm.svg'),
  mozilla: require('./images/mozilla.svg'),
  sap: require('./images/sap.svg'),
};
