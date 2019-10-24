import { CustomGoal } from './goals';

export type UserClient = {
  email?: string;
  username?: string;
  client_id?: string;
  age?: string;
  gender?: string;
  locales?: { locale: string; accent: string }[];
  visible?: 0 | 1;
  basket_token?: string;
  skip_submission_feedback?: boolean;
  avatar_url?: string;
  avatar_clip_url?: string;
  clips_count?: number;
  votes_count?: number;
  awards?: any[];
  custom_goals?: CustomGoal[];
  enrollment?: { challenge: string; team: string; invite: string };
};
