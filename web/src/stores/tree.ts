import API from '../services/api';
import { Recordings } from './recordings';
import { User } from './user';
import { Clips } from './clips';
import { RequestedLanguages } from './requested-langauges';

export default interface StateTree {
  api: API;
  recordings: Recordings.State;
  user: User.State;
  clips: Clips.State;
  requestedLanguages: RequestedLanguages.State;
};
