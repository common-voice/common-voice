import API from '../services/api';
import { Clips } from './clips';
import { Notifications } from './notifications';
import { Sentences } from './sentences';
import { RequestedLanguages } from './requested-languages';
import { Uploads } from './uploads';
import { User } from './user';

export default interface StateTree {
  api: API;
  sentences: Sentences.State;
  user: User.State;
  clips: Clips.State;
  requestedLanguages: RequestedLanguages.State;
  locale: string;
  notifications: Notifications.State;
  uploads: Uploads.State;
};
