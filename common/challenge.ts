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
export type ChallengeTeamToken = 'ibm' | 'mozilla' | 'sap';

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
