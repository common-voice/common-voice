import { CustomGoal } from './goals';
import { Enrollment } from './challenge';
import { AccentLocale } from './locale';

export type UserClient = {
  email?: string;
  username?: string;
  client_id?: string;
  age?: string;
  gender?: string;
  locales?: AccentLocale[];
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
