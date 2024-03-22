import { CustomGoal } from './goals';
import { Enrollment } from './challenge';
import { UserLanguage } from './language';

export type UserClient = {
  email?: string;
  username?: string;
  client_id?: string;
  age?: string;
  gender?: string;
  languages?: UserLanguage[];
  visible?: 0 | 1 | 2;
  basket_token?: string;
  skip_submission_feedback?: boolean;
  avatar_url?: string;
  avatar_clip_url?: string;
  clips_count?: number;
  votes_count?: number;
  awards?: any[];
  custom_goals?: CustomGoal[];
  enrollment?: Enrollment;
};

export type Gender = {
  male_masculine: string;
  female_feminine: string;
  intersex: string;
  transgender: string;
  'non-binary': string;
  do_not_wish_to_say: string;
};
