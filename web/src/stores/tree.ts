import API from '../services/api';
import { Recordings } from './recordings';
import { User } from './user';
import { Clips } from './clips';

export default interface StateTree {
  api: API;
  recordings: Recordings.State;
  user: User.State;
  clips: Clips.State;
};
