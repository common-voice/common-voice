import API from '../services/api';
import { Recordings } from './recordings';
import { User } from './user';
import {Validations} from "./validations";

export default interface StateTree {
  api: API;
  recordings: Recordings.State;
  user: User.State;
  validations: Validations.State
};
