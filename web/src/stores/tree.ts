import API from '../services/api';
import { Recordings } from './recordings';
import { User } from './user';

export default interface StateTree {
  api: API;
  recordings: Recordings.State;
  user: User.State;
};
