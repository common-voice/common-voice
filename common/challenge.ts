export interface WeeklyChallenge {
  week: number;
  user: {
    speak: number;
    speak_total: number;
    listen: number;
    listen_total: number;
  };
  team: {
    invite: number;
    invite_total: number;
  };
}

export interface Challenge {
  position: number;
  name: string;
  logo: string;
  points: number;
  approved: number;
  accuracy: number;
  cursor?: [number, number];
}

export interface TeamChallenge {
  position: number;
  name: string;
  logo: string;
  rank: number;
  points: number;
}

export type ChallengeToken = 'pilot';
export type ChallengeTeamToken = 'ibm' | 'lenovo' | 'mozilla' | 'sap';
export type Enrollment = {
  challenge: ChallengeToken;
  team: ChallengeTeamToken;
  invite?: string; // Friend's code on initial sign-up, otherwise the user's personal code.
  referer?: string; // Only exists on initial sign-up.
};

export type ChallengeDuration = {
  start: Date;
  end: Date;
};

export type AchievementType =
  | 'sign_up_first_three_days'
  | 'invite_signup'
  | 'first_contribution'
  | 'three_day_streak'
  | 'invite_send'
  | 'invite_contribute_same_session';

interface ChallengeTeam {
  readableName: string;
  token: ChallengeTeamToken;
}

export interface ChallengeRequestArgument {
  client_id: string;
  params: {
    challenge: ChallengeToken;
    locale?: any; // FIXME: More specific type.
    type?: 'vote' | 'clip';
    bonus_type?: 'session' | 'invite';
  };
  query: {
    cursor?: any;
  };
}

export interface ChallengeLeaderboardArgument {
  client_id: string;
  challenge: ChallengeToken;
  locale: string;
  team_only: boolean;
}

export const challengeTeams: { [key in ChallengeTeamToken]: ChallengeTeam } = {
  ibm: {
    readableName: 'IBM',
    token: 'ibm',
  },
  lenovo: {
    readableName: 'Lenovo',
    token: 'lenovo',
  },
  mozilla: {
    readableName: 'Mozilla',
    token: 'mozilla',
  },
  sap: {
    readableName: 'SAP',
    token: 'sap',
  },
};

// For run-time checking.
export const challengeTokens: ChallengeToken[] = ['pilot'];
export const challengeTeamTokens = Object.values(challengeTeams).map(
  team => team.token
);
