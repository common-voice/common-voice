import API from '../services/api';
import { Clips } from './clips';
import { Notifications } from './notifications';
import { Recordings } from './recordings';
import { RequestedLanguages } from './requested-languages';
import { Uploads } from './uploads';
import { User } from './user';

export default interface StateTree {
  api: API;
  recordings: Recordings.State;
  user: User.State;
  clips: Clips.State;
  requestedLanguages: RequestedLanguages.State;
  locale: string;
  notifications: Notifications.State;
  uploads: Uploads.State;
};
